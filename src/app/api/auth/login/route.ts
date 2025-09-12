import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/jwt/auth.jwt';
import { getErrorMessage } from '@/utils/errors';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 400 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 400 });
    }

    if (!user.is_activated) {
      return NextResponse.json({ ok: false, error: 'User not verified/activated' }, { status: 403 });
    }

    const token = generateToken({ id: user.id, role: user.role.name });
    return NextResponse.json({
      ok: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role.name,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ ok: false, error: getErrorMessage(err) }, { status: 400 });
  }
}
