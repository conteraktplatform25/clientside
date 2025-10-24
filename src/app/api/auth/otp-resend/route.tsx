import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { getErrorMessage } from '@/utils/errors';
import { renderTemplate } from '@/lib/helpers/render-template.helper';
import { generateOTP } from '@/lib/helpers/generate-otp.helper';
import bcrypt from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, flow } = await req.json();
    const request_type: string | undefined = flow;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, message: 'If an account exists, an email will be sent.' }, { status: 400 });
    }

    // Generate verification token
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: hashedOTP,
        expires,
      },
    });

    // fetch notification template
    if (request_type === 'reset') {
      const template = await prisma.notificationTemplate.findFirst({
        where: {
          notificationType: { name: 'RESET_PASSWORD' },
        },
      });
      if (template) {
        const full_name = user.first_name + ' ' + user.last_name;
        let subject = '';
        let content = '';
        const expiry_minutes = Math.round((expires.getTime() - new Date().getTime()) / (1000 * 60));

        subject = template.subject || 'Reset your password';
        content = renderTemplate(template.custom_content || template.default_content || '', {
          full_name: full_name,
          email: email || '',
          expiry_minutes: expiry_minutes.toString(),
          otp_code: otp,
          support_email: 'conteraktplatform25@gmail.com',
        });
        // Send email verification
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: ['conteraktplatform25@gmail.com'],
          subject: subject,
          html: content,
        });
        return NextResponse.json(
          { ok: true, message: 'If an account exists, an email will be sent.' },
          { status: 200 }
        );
      }
    } else {
      const template = await prisma.notificationTemplate.findFirst({
        where: {
          notificationType: { name: 'SIGNUP_VERIFICATION' },
        },
      });

      if (template) {
        const full_name = user.first_name + ' ' + user.last_name;
        const subject = template.subject || 'Verify your email';

        // Send email verification
        await resend.emails.send({
          // from: 'Concakt Platform Signup <yourname@resend.dev>',
          from: 'onboarding@resend.dev',
          to: ['conteraktplatform25@gmail.com'],
          subject: subject,
          html: `<p>Hi ${full_name},</p>
               <p>Your verification code is <strong>${otp}</strong>.</p>
               <p>This code will expire in 10 minutes.</p>`,
        });
        return NextResponse.json(
          { ok: true, profile: user, message: 'Successful registration. Check email for OTP Code.' },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ ok: false, message: getErrorMessage(error) }, { status: 400 });
  }
}
