import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
//import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    first_name,
    last_name,
    company_name,
    phone_number,
    whatsapp_business_number,
    company_location,
    company_website,
    business_industry,
    business_category,
    annual_revenue,
  } = await req.json();

  if (!email || !password || !first_name || !last_name) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const defaultRole = await prisma.role.findFirst({ where: { is_default: true } });
  if (!defaultRole) {
    return NextResponse.json({ ok: false, error: 'No default role found' }, { status: 500 });
  }

  const result = await prisma.$transaction(async (tx) => {
    //Step 1: Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone: phone_number,
        roleId: defaultRole.id,
        is_activated: false,
        email_verified_date: new Date(),
      },
    });

    // Step 2: Create business profile linked to user
    const business_profile = await prisma.businessProfile.create({
      data: {
        userId: user.id,
        company_name,
        phone_number,
        business_number: whatsapp_business_number,
        company_location,
        company_website,
        business_category,
        business_industry,
        annual_revenue,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { is_activated: true },
    });

    return { user, business_profile };
  });

  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     password: hashedPassword,
  //     first_name,
  //     last_name,
  //     roleId: defaultRole.id,
  //     is_activated: false, // implement mailing system to activate
  //     email_verified_date: new Date(),
  //   },
  // });

  // Generate JWT verification token
  // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  // // Send verification email
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_SERVER_HOST,
  //   port: Number(process.env.EMAIL_SERVER_PORT),
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL_SERVER_USER,
  //     pass: process.env.EMAIL_SERVER_PASSWORD,
  //   },
  // });

  // const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/emailverification?token=${token}`;

  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: 'Verify Your Account',
  //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  // });

  return NextResponse.json(
    { ok: true, message: 'User registered. Check your email for verification.', ...result },
    { status: 201 }
  );
}
