// src/app/api/whatsapp/onboarding/init/route.ts

import prisma from '@/lib/prisma';
import { buildMetaOAuthUrl } from '@/lib/whatsapp/meta_ai_oauth';
import { getErrorMessage } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const { phone_number } = await req.json();

    if (!email || !phone_number) {
      return NextResponse.json({ ok: false, message: 'Email and business_number are required' }, { status: 400 });
    }

    // Find user first
    const user = await prisma.user.findUnique({ where: { email, is_deleted: false } });
    if (!user) return NextResponse.json({ ok: false, error: 'User does not exist.' }, { status: 404 });
    if (!user.is_activated)
      return NextResponse.json({ ok: false, error: 'User Access has not been activated.' }, { status: 403 });

    //Verify if user profile has an organization registered under
    const businessTeam = await prisma.businessTeamProfile.findFirst({ where: { userId: user.id } });
    if (!businessTeam) return NextResponse.json({ ok: false, error: 'Business Profile not found.' }, { status: 404 });
    if (businessTeam.status !== 'ACTIVE')
      return NextResponse.json({ ok: false, error: 'User Business profile not yet active.' }, { status: 404 });

    const businessProfile = await prisma.businessProfile.findFirst({
      where: { userId: user.id },
    });
    if (!businessProfile)
      return NextResponse.json({ ok: false, message: 'Business profile not found' }, { status: 404 });
    const businessProfileId = businessProfile.id;

    await prisma.whatsAppAccount.upsert({
      where: { businessProfileId },
      update: {
        displayPhone: phone_number,
        status: 'PENDING',
      },
      create: {
        businessProfileId: businessProfile.id,
        displayPhone: phone_number,
        status: 'PENDING',
      },
    });

    const redirectUrl = buildMetaOAuthUrl(businessProfileId);

    return NextResponse.json({
      ok: true,
      redirectUrl,
    });
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error('POST /whatsapp/onboarding/init error:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
