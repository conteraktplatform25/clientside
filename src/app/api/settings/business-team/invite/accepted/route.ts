import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import { ActivityType } from '@/lib/constants/settings.constant';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) return NextResponse.json({ ok: false, error: 'Token required' }, { status: 400 });

    const invitation = await prisma.businessTeamMemberInvitation.findUnique({
      where: { token },
      include: {
        role: true,
        business: true,
      },
    });
    if (!invitation || invitation.accepted || invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invitation expired or invalid' }, { status: 400 });
    }

    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id: invitation.businessProfileId },
      select: {
        id: true,
        company_name: true,
      },
    });
    if (!businessProfile) {
      return NextResponse.json({ error: 'Business information no longer exist.' }, { status: 404 });
    }

    // Update token
    await prisma.businessTeamMemberInvitation.update({
      where: { id: invitation.id },
      data: { accepted: true },
    });

    /****************************************************************************************
     * Activate the Activity Log
     */
    await prisma.userActivity.create({
      data: {
        businessProfileId: invitation.businessProfileId,
        name: invitation.email,
        type: ActivityType.TEAM_INVITE_ACCEPTED,
        description: `Team Member has accepted the invite from ${businessProfile.company_name}.`,
        metadata: {
          email: invitation.email,
          roleName: invitation.role.name,
          businessName: businessProfile.company_name,
        },
      },
      select: { id: true },
    });
    /******************************************************************************************* */

    // Redirect to signin or dashboard
    return NextResponse.redirect(
      new URL(
        `/invited-member?accepted=true&email=${invitation.email}&company=${businessProfile.company_name}&business=${invitation.businessProfileId}&invitedby=${invitation.invitedBy}&function=${invitation.role.id}`,
        req.url
      )
    );
  } catch (error) {
    return NextResponse.json({ ok: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
