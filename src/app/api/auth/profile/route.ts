import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const {
      password,
      phone_number,
      company_name,
      company_website,
      company_location,
      business_industry,
      business_category,
      annual_revenue,
    } = await req.json();

    if (!email || !phone_number || !password) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Email does not exist' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const businessProfile = await prisma.businessProfile.create({
      data: {
        userId: user.id,
        company_name,
        phone_number,
        company_location,
        company_website,
        business_industry,
        business_category,
        annual_revenue,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.businessTeamProfile.create({
        data: {
          businessProfileId: businessProfile.id,
          userId: user.id,
          roleId: user.role.id,
          joined_at: new Date(),
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { email_verified_date: new Date(), is_activated: true, phone: phone_number, password: hashedPassword },
      });
    });

    // Update user profile

    return NextResponse.json(
      {
        ok: true,
        profile: businessProfile,
        message: 'Successfully saved business profile.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(getErrorMessage(error));
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
