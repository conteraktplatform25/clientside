import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';

// PATCH /api/auth/profile/business-number?email=...
export async function PATCH(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const { phone_number } = await req.json();

    if (!email || !phone_number) {
      return NextResponse.json({ ok: false, message: 'Email and business_number are required' }, { status: 400 });
    }

    // Find user first
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    // Update BusinessProfile linked to this user
    const updatedProfile = await prisma.businessProfile.updateMany({
      where: { userId: user.id },
      data: { business_number: phone_number },
    });

    if (updatedProfile.count === 0) {
      return NextResponse.json({ ok: false, error: 'No business profile found for this user' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: 'Business number updated successfully' }, { status: 200 });
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
