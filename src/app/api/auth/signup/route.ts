import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { getErrorMessage } from '@/utils/errors';
import { renderTemplate } from '@/lib/helpers/render-template.helper';
import { User } from '@prisma/client';
import { generateOTP } from '@/lib/helpers/generate-otp.helper';
import bcrypt from 'bcryptjs';
import { success } from '@/utils/response';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email, first_name, last_name } = await req.json();

    if (!email || !first_name || !last_name) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    let user: User | null = null;

    // Get default role (e.g., 'user')
    const defaultRole = await prisma.role.findFirst({ where: { is_default: true } });
    if (!defaultRole) {
      return NextResponse.json({ ok: false, error: 'No default role found' }, { status: 500 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.is_activated) {
        return NextResponse.json({ ok: false, error: 'Email already exists and active' }, { status: 409 });
      } else {
        user = await prisma.user.update({
          where: { email },
          data: {
            first_name,
            last_name,
            updated_at: new Date(),
          },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          first_name,
          last_name,
          roleId: defaultRole.id,
          is_activated: false, // Wait for email verification
        },
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: hashedOTP,
        expires,
      },
    });

    // fetch notification template
    const template = await prisma.notificationTemplate.findFirst({
      where: {
        notificationType: { name: 'SIGNUP_VERIFICATION' },
      },
    });
    if (template) {
      const full_name = user.first_name + ' ' + user.last_name;
      let subject = '';
      let content = '';
      const expiry_minutes = Math.round((expires.getTime() - new Date().getTime()) / (1000 * 60));

      subject = 'Contact Signup Verification';
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
      return success(true, 'If an account exists, an email will be sent.');
    }
    return success(true, 'Email was not successfully sent. Contact Contakt Support.');
    //// Generate verification token
    // const token = uuidv4();
    // const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    // await prisma.verificationToken.create({
    //   data: {
    //     identifier: email,
    //     token,
    //     expires,
    //   },
    // });

    // const template = await prisma.notificationTemplate.findFirst({
    //   where: {
    //     notificationType: { name: 'SIGNUP_VERIFICATION' },
    //   },
    // });

    //// const baseURL = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${user.email}`;

    // if (template) {
    //   const full_name = user.first_name + ' ' + user.last_name;
    //   const subject = template.subject || 'Verify your email';
    //   const content = renderTemplate(template.custom_content || template.default_content || '', {
    //     name: full_name,
    //     email: email,
    //     token: token,
    //     APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    //   });

    //   // Send email verification
    //   await resend.emails.send({
    //     // from: 'Concakt Platform Signup <yourname@resend.dev>',
    //     from: 'onboarding@resend.dev',
    //     to: ['conteraktplatform25@gmail.com'],
    //     subject: subject,
    //     html: content,
    //   });
    //   return NextResponse.json(
    //     { ok: true, profile: user, message: 'Successful registration. Check email to verify.' },
    //     { status: 201 }
    //   );
    // }

    // return NextResponse.json(
    //   {
    //     ok: true,
    //     profile: user,
    //     message: 'Registration was successful but mail failed to reach client. Contact Contakt Support.',
    //   },
    //   { status: 201 }
    // );
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
