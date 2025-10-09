import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import { comparePassword, generateTokens } from '@/actions/mobile-auth';
import { UserObject } from 'next-auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 400 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 400 });
    }

    if (!user.is_activated) {
      return NextResponse.json({ ok: false, message: 'User not verified/activated' }, { status: 403 });
    }

    //get Userprofile details
    const business_profile = await prisma.businessProfile.findFirst({
      where: { userId: user.id },
      select: {
        business_number: true,
      },
    });
    const business_number = business_profile?.business_number ?? '';

    const payload: UserObject = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role.name,
      image: user.image,
      phone_number: user.phone,
      registered_number: business_number,
    };

    const token = generateTokens(payload);
    return NextResponse.json({
      ok: true,
      message: 'Login successful',
      token,
      payload,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ ok: false, message: getErrorMessage(err) }, { status: 400 });
  }
}
