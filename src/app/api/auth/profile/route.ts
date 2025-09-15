import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const {
      phone_country_code,
      phone_number,
      company_name,
      company_website,
      company_location,
      business_industry,
      business_category,
      annual_revenue,
    } = await req.json();

    if (!email || !phone_number) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 409 });
    }

    // Create user (not activated yet)
    const businessProfile = await prisma.businessProfile.create({
      data: {
        userId: user.id,
        company_name,
        phone_number: `(${phone_country_code})${phone_number}`,
        company_location,
        company_website,
        business_industry,
        business_category,
        annual_revenue,
      },
    });

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
