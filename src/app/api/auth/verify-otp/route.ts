import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, flow } = await req.json();
    let request_type: string | undefined = flow;

    if (!email || !otp) {
      return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    }
    if (!flow) request_type = 'signup';

    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        isTokenUsed: false,
        expires: { gt: new Date() },
      },
      orderBy: { id: 'desc' }, // latest OTP if multiple exist
    });

    if (!record) {
      return NextResponse.json({ ok: false, message: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (record.identifier !== email) {
      return NextResponse.json({ ok: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    if (record.expires < new Date()) {
      return NextResponse.json({ ok: false, message: 'One time password has expired' }, { status: 400 });
    }

    // Compare entered OTP with hashed OTP
    const isValid = await bcrypt.compare(otp, record.token);
    if (!isValid) {
      return NextResponse.json({ ok: false, message: 'Invalid OTP' }, { status: 400 });
    }

    // Mark OTP as used
    await prisma.verificationToken.update({
      where: { id: record.id },
      data: { isTokenUsed: true },
    });

    // Activate user
    if (request_type === 'signup') {
      await prisma.user.update({
        where: { email },
        data: { is_activated: true, email_verified_date: new Date() },
      });
    }

    if (request_type === 'signup')
      return NextResponse.json({ ok: true, message: 'Email verified successfully.' }, { status: 200 });
    return NextResponse.json({ ok: true, message: 'One time Password verified successfully.', flow }, { status: 200 });
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ ok: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
