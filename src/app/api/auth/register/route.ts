import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getErrorMessage } from '@/utils/errors';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await req.json();

    console.log(email);

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Get default role (e.g., 'user')
    const defaultRole = await prisma.role.findFirst({ where: { is_default: true } });
    if (!defaultRole) {
      return NextResponse.json({ ok: false, error: 'No default role found' }, { status: 500 });
    }

    // Create user (not activated yet)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        roleId: defaultRole.id,
        is_activated: false, // Wait for email verification
      },
    });

    // Generate verification token
    const token = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
    const full_name = first_name + ' ' + last_name;

    // Render email
    const emailHtml = `
    <html>
      <body>
        <h1>Welcome, ${full_name}!</h1>
        <p>Thank you for registering with your email: ${email}</p>
        <p><a href="http://localhost:3000/api/auth/verify?token=${token}">Verify your email</a></p>
      </body>
    </html>
  `;

    // Send email verification
    await resend.emails.send({
      // from: 'Concakt Platform Signup <yourname@resend.dev>',
      from: 'onboarding@resend.dev',
      to: ['conteraktplatform25@gmail.com'],
      subject: 'Verify your email',
      html: emailHtml,
    });

    return NextResponse.json(
      { ok: true, profile: user, message: 'User created. Check email to verify.' },
      { status: 201 }
    );
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
