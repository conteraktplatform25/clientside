import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { Resend } from 'resend';
import { getErrorMessage } from '@/utils/errors';
import { renderTemplate } from '@/lib/helpers/render-template.helper';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, message: 'If an account exists, an email will be sent.' }, { status: 400 });
    }

    const token = uuidv4();
    const expires = addHours(new Date(), 12); // expires in 12 hour

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // fetch notification template
    const template = await prisma.notificationTemplate.findFirst({
      where: {
        notificationType: { name: 'RESET_PASSWORD' },
      },
    });

    if (template) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${user.email}`;
      const full_name = user.first_name + ' ' + user.last_name;
      let subject = '';
      let content = '';
      // Send email verification
      await resend.emails.send({
        // from: 'Concakt Platform Signup <yourname@resend.dev>',
        from: 'onboarding@resend.dev',
        to: ['conteraktplatform25@gmail.com'],
        subject: subject,
        html: content,
      });
      subject = template.subject || 'Reset your password';
      content = renderTemplate(template.custom_content || template.default_content || '', {
        full_name: full_name,
        email: email || '',
        RESET_LINK: resetLink,
      });
      return NextResponse.json({ ok: true, message: 'If an account exists, an email will be sent.' }, { status: 200 });
    }

    return NextResponse.json(
      { ok: true, message: 'Email was not successfully sent. Contact Contakt Support.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) });
  }
}
