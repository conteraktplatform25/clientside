import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { getErrorMessage } from '@/utils/errors';
import { renderTemplate } from '@/lib/helpers/render-template.helper';
import { generateOTP } from '@/lib/helpers/generate-otp.helper';
import bcrypt from 'bcryptjs';
import { failure, success } from '@/utils/response';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return failure('If an account exists, an email will be sent.', 404);
    }

    // const token = uuidv4();
    // const expires = addHours(new Date(), 12); // expires in 12 hour
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
    const template = await prisma.notificationTemplate.findFirst({
      where: {
        notificationType: { name: 'RESET_PASSWORD' },
      },
    });

    if (template) {
      //const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${user.email}`;
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
      return success(true, 'If an account exists, an email will be sent.');
    }
    return success(true, 'Email was not successfully sent. Contact Contakt Support.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/forgot-password error:', err);
    return failure(message, 500);
  }
}
