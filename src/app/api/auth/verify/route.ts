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
    const user = await prisma.user.update({
      where: { email: verification.identifier },
      data: { email_verified_date: new Date(), is_activated: true },
    });
    const full_name = user.first_name + ' ' + user.last_name;

    // Update token
    await prisma.verificationToken.update({
      where: { token },
      data: { isTokenUsed: true },
    });

    // Redirect to signin or dashboard
    return NextResponse.redirect(new URL(`/profile?verified=true&email=${user.email}&name=${full_name}`, req.url));
  } catch (error) {
    return NextResponse.json({ ok: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
