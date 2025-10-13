import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        isTokenUsed: false,
        expires: { gt: new Date() },
      },
      orderBy: { id: 'desc' }, // latest OTP if multiple exist
    });

    if (!record) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Compare entered OTP with hashed OTP
    const isValid = await bcrypt.compare(otp, record.token);
    if (!isValid) {
      return NextResponse.json({ ok: false, error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark OTP as used
    await prisma.verificationToken.update({
      where: { id: record.id },
      data: { isTokenUsed: true },
    });

    // Activate user
    await prisma.user.update({
      where: { email },
      data: { is_activated: true, email_verified_date: new Date() },
    });

    return NextResponse.json({ ok: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ ok: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
