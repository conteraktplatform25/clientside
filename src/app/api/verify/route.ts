import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { getErrorMessage } from '@/utils/errors';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    if (user.is_activated) {
      return NextResponse.json({ message: 'Account already verified' }, { status: 200 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_activated: true,
        email_verified_date: new Date(),
      },
    });
    // Redirect to login after verification
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`);
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: getErrorMessage(err) }, { status: 400 });
  }
}
