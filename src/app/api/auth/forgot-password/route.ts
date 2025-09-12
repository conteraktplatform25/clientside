// Similar to signup: Generate token, send email with reset link /auth/reset?token=...
// Then /api/auth/reset POST: Validate token, update password hash.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
//import { Resend } from 'resend';

//const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ ok: false, error: 'Email does not exist' }, { status: 409 });
    }
  } catch (error) {
    console.error(error);
  }
}
