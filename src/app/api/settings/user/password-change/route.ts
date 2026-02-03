import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getErrorMessage } from '@/utils/errors';
import { authenticateRequest } from '@/lib/auth';
import { failure, success } from '@/utils/response';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import {
  SettingsPasswordChangeRequestSchema,
  SettingsPasswordChangeResponseSchema,
} from '@/lib/schemas/business/server/settings.schema';
import { comparePassword } from '@/actions/mobile-auth';
import { User } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(SettingsPasswordChangeRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { email, current_password, new_password } = validation.data;
    // verify the incoming email address
    if (user.email !== email) {
      return failure('Invalid Email owner.');
    }

    //Compare current password with the application current owners password
    let passwordHashed = user.password ?? null;
    let user_profile: User | null = null;
    if (!passwordHashed) {
      user_profile = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });
      passwordHashed = user_profile ? user_profile?.password : null;
    }
    if (passwordHashed === null) {
      return failure('Invalid current password.', 400);
    }
    const isValid = await comparePassword(current_password, passwordHashed);
    if (!isValid) {
      return failure('Invalid credentials.', 400);
    }

    // Hash new Password and then update into the User Password table
    const hashedNewPassword = await bcrypt.hash(new_password, 12);
    const responseData = await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });
    const user_response = SettingsPasswordChangeResponseSchema.parse(responseData);
    return success(user_response, 'Password change successful');
  } catch (err) {
    const message = getErrorMessage(err);
    console.log('POST -> business team -> Password Change, error', message);
    return failure(`Team Password Change error -> ${message}`);
  }
}
