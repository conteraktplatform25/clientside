import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getErrorMessage } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();

    const dbToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!dbToken || dbToken.identifier !== email) {
      return NextResponse.json({ ok: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    if (dbToken.expires < new Date()) {
      return NextResponse.json({ ok: false, message: 'Token expired' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { id: dbToken.id },
    });

    return NextResponse.json({ ok: true, message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) });
  }
}
