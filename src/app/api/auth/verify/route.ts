import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    console.log(token);
    if (!token) return NextResponse.json({ ok: false, error: 'Token required' }, { status: 400 });

    const verification = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verification || verification.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Activate user
    await prisma.user.update({
      where: { email: verification.identifier },
      data: { email_verified_date: new Date(), is_activated: true },
    });

    // Delete token
    await prisma.verificationToken.delete({ where: { token } });

    // Redirect to signin or dashboard
    return NextResponse.redirect(new URL('/auth/login?verified=true', req.url));
  } catch (error) {
    return NextResponse.json({ ok: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
