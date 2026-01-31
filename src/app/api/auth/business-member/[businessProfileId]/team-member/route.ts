import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import bcrypt from 'bcryptjs';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import {
  MemberRegistrationFormSchema,
  MemberRegistrationResponseSchema,
} from '@/lib/schemas/business/server/settings.schema';
import { success, failure } from '@/utils/response';

export async function POST(req: NextRequest, context: { params: Promise<{ businessProfileId: string }> }) {
  try {
    const { businessProfileId } = await context.params;
    if (!businessProfileId) return failure('Query parameter cannot be empty.', 403);

    //Verify if Business Profile exist
    const businessProfile = await prisma.businessProfile.findUnique({
      where: {
        id: businessProfileId,
      },
    });
    if (!businessProfile) return failure('Business profile not found.', 404);

    const validation = await validateRequest(MemberRegistrationFormSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { first_name, last_name, email, phone_number, password, roleId, invitedby } = validation.data;

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const existingMembership = await prisma.businessTeamProfile.findUnique({
        where: {
          businessProfileId_userId: {
            businessProfileId,
            userId: user.id,
          },
        },
      });
      if (existingMembership) return failure('User already belongs to this business', 409);
    }

    //verify the selected role
    // 4️⃣ Get default role
    const assignedRole = await prisma.role.findFirst({
      where: { id: roleId },
      select: {
        name: true,
      },
    });

    if (!assignedRole) return failure('Assigned role not configured', 404);

    // 5️⃣ Transaction (CRITICAL)
    const result = await prisma.$transaction(async (tx) => {
      // Create user if needed
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 12);

        user = await tx.user.create({
          data: {
            email,
            phone: phone_number,
            first_name,
            last_name,
            password: hashedPassword,
            roleId,
            is_activated: true,
          },
        });
      }

      // Create business membership
      const teamProfile = await tx.businessTeamProfile.create({
        data: {
          businessProfileId,
          userId: user!.id,
          roleId,
          status: 'ACTIVE',
          joined_at: new Date(),
          invited_by: invitedby,
        },
        select: {
          id: true,
          businessProfileId: true,
          status: true,
          invited_by: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      // Activity log (optional but recommended)
      await tx.userActivity.create({
        data: {
          businessProfileId,
          name: `${first_name} ${last_name}`,
          type: 'team_member_created',
          description: `${first_name} ${last_name} joined the team`,
          metadata: {
            email,
            role: assignedRole.name,
          },
        },
      });

      return teamProfile;
    });

    const memberProfile = MemberRegistrationResponseSchema.parse(result);
    return success({ memberProfile }, 'Member successfully created', 201);
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
