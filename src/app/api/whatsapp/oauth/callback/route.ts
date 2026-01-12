// app/api/whatsapp/oauth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
//import { inngest } from '@/lib/inngest';
import { exchangeCodeForToken, fetchWhatsAppBusinessAccount } from '@/lib/whatsapp/meta_ai_oauth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get('code');
  const businessProfileId = searchParams.get('state'); // orgId
  if (!businessProfileId) return;

  // get by businessProfileID
  const app_profile = await prisma.businessProfile.findUnique({
    where: { id: businessProfileId },
    include: {
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
  if (!app_profile) return;

  const full_name = `${app_profile?.user.first_name} ${app_profile.user.last_name}`;

  if (!code || !businessProfileId) {
    return NextResponse.redirect('/error?reason=missing_params');
    //return NextResponse.json({ error: 'Invalid callback' }, { status: 400 });
  }

  const { accessToken, expiresAt } = await exchangeCodeForToken(code);
  const { metaBusinessId, wabaId, phoneNumbers } = await fetchWhatsAppBusinessAccount(accessToken);

  //console.log('Whatsapp OAUTH Onboarding endpoint: ', `${metaBusinessId}`);
  // const WABA_BUSINESS_ACCOUNT_ENDPOINT = `${BASE_URL}/${API_VERSION}/me/whatsapp_business_accounts`;
  // // 2. Get WABA
  // const wabaRes = await fetch(WABA_BUSINESS_ACCOUNT_ENDPOINT, {
  //   headers: { Authorization: `Bearer ${accessToken}` },
  // });

  //const wabaData = await wabaRes.json();
  //const wabaId = wabaData.data?.[0]?.id;

  // const WABA_GET_PHONE_ENDPOINT = `${BASE_URL}/${API_VERSION}/${wabaId}/phone_numbers`;

  // // 3. Get phone numbers
  // const phoneRes = await fetch(WABA_GET_PHONE_ENDPOINT, {
  //   headers: { Authorization: `Bearer ${accessToken}` },
  // });

  // const phoneData = await phoneRes.json();
  // const phone = phoneData.data?.[0];

  await prisma.$transaction(async (tx) => {
    await tx.businessProfile.update({
      where: { id: businessProfileId },
      data: {
        metaBusinessId,
        wabaId,
        account_status: 'ACTIVE',
      },
    });

    const accountProfile = await tx.whatsAppAccount.update({
      where: { businessProfileId },
      data: {
        metaBusinessId,
        wabaId,
        phoneNumberId: phoneNumbers[0].id,
        accessToken,
        tokenExpiresAt: expiresAt,
        status: 'META_AUTHORIZED',
      },
    });

    for (const phone of phoneNumbers) {
      await tx.whatsAppPhoneNumber.upsert({
        where: { phoneNumberId: phone.id },
        update: {
          displayName: phone.verified_name,
          phoneNumber: phone.display_phone_number,
          status: 'VERIFIED',
        },
        create: {
          businessProfileId,
          whatsappAccountId: accountProfile.id,
          phoneNumberId: phone.id,
          phoneNumber: phone.display_phone_number,
          displayName: phone.verified_name,
          status: 'VERIFIED',
        },
      });
    }
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/whatsapp-connect/success?name=${full_name}`);
}
