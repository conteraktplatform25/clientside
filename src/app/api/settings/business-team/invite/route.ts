import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import {
  BusinessTeamQuerySchema,
  InvitedTeamMemberListResponseSchema,
  InviteTeamMemberRequestSchema,
  InviteTeamMemberResponseSchema,
} from '@/lib/schemas/business/server/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';
import crypto from 'crypto';
import TeamMemberInviteEmail from '@/emails/TeamMemberInviteEmail';
import { ActivityType } from '@/lib/constants/settings.constant';
import { Prisma } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 404);

    const validation = await validateRequest(BusinessTeamQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search } = validation.data;
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessTeamMemberInvitationWhereInput = { businessProfileId, accepted: false };
    if (search) {
      where.OR = [{ email: { contains: search, mode: 'insensitive' } }];
    }

    const [invitePaginated, total] = await Promise.all([
      prisma.businessTeamMemberInvitation.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          email: true,
          role: { select: { id: true, name: true } },
          invitee: { select: { id: true, first_name: true, last_name: true, email: true } },
          accepted: true,
          createdAt: true,
          business: {
            select: {
              company_name: true,
            },
          },
        },
      }),
      prisma.businessTeamMemberInvitation.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const responseData = {
      pagination: { page, limit, total, totalPages },
      invitedTeam: invitePaginated,
    };
    const invite_team = InvitedTeamMemberListResponseSchema.parse(responseData);

    return success(invite_team, 'List of invited members successfully retrieved.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/settings/business-team/invite error:', message);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);

    const isAuthorized = authorizeRole(user, ['Business']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(InviteTeamMemberRequestSchema, req);
    if (!validation.success) return failure(validation.response, 400);

    const { email, roleId } = validation.data;

    /* Prevent inviting existing team member */
    const existingMember = await prisma.businessTeamProfile.findFirst({
      where: {
        businessProfileId,
        user: {
          email,
          is_deleted: false,
        },
      },
    });
    if (existingMember) return failure('Team Member already exist in your business.', 409);

    /* Prevent duplicate active invitation */
    const activeInvite = await prisma.businessTeamMemberInvitation.findFirst({
      where: {
        businessProfileId,
        email,
        accepted: false,
        expiresAt: { gt: new Date() },
      },
    });
    if (activeInvite) return failure('An active invitation already exists for this email', 409);

    /* Generate secure token */
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 72); // 72 hours ~ 3days

    /* Create invitation */
    const invitation = await prisma.businessTeamMemberInvitation.create({
      data: {
        businessProfileId,
        email,
        roleId,
        token,
        expiresAt,
        invitedBy: user.id,
      },
      select: {
        id: true,
        email: true,
        expiresAt: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
        business: {
          select: {
            company_name: true,
          },
        },
      },
    });

    /******* 6️⃣ TODO: Send email *************************************************************/
    /**
     * inviteUrl:
     * `${process.env.NEXT_PUBLIC_APP_URL}/invite/accept?token=${token}`
     */
    // fetch notification template
    const template = await prisma.notificationTemplate.findFirst({
      where: {
        notificationType: { name: 'TEAM_MEMBER_INVITATION' },
      },
    });
    if (template) {
      const invite_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/settings/business-team/invite/accepted?token=${token}`;
      const invitee_name = user.first_name + ' ' + user.last_name;
      const subject = `Invitation to collaborate with ${invitation.business.company_name} on the Contakt platform`;
      const expiry_hours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));

      // Send email verification
      await resend.emails.send({
        from: 'Contakt <onboarding@resend.dev>',
        to: ['conteraktplatform25@gmail.com'],
        subject: subject,
        react: TeamMemberInviteEmail({
          inviterName: invitee_name,
          businessName: invitation.business.company_name,
          inviteUrl: invite_url,
          expiryHour: expiry_hours,
          supportEmail: 'conteraktplatform25@gmail.com',
        }),
      });
    }
    /******************************************************************************************* */
    /****************************************************************************************
     * Activate the Activity Log
     */
    await prisma.userActivity.create({
      data: {
        businessProfileId,
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email,
        type: ActivityType.TEAM_INVITE_SENT,
        description: `Invited ${email} to join the team as ${invitation.role.name}`,
        metadata: {
          email,
          roleId,
          roleName: invitation.role.name,
          expiresAt,
        },
      },
      select: { id: true },
    });
    /******************************************************************************************* */
    const invitation_profile = InviteTeamMemberResponseSchema.parse({
      ...invitation,
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    });
    return success({ invitation_profile }, 'Invitation sent successfully');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/settings/business-team/invite error:', message);
    return failure(message, 500);
  }
}
