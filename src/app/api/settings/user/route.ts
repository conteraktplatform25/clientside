import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { UpdateUserSettingsSchema, UserSettingsResponseSchema } from '@/lib/schemas/business/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);

    const userId = user.id;
    if (!userId) return failure('User profile not configured.', 400);

    const response = UserSettingsResponseSchema.parse(user);
    console.log(response);

    return success(response, 'Successful retrieval');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const userId = user.id;
    if (!userId) return failure('User profile not configured.', 400);

    const validation = await validateRequest(UpdateUserSettingsSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { phone_country_code, phone_number, ...data } = validation.data;

    const isExisting = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!isExisting) {
      return failure('Business does not currently exists. Contact Support for more information.', 409);
    }

    // Update User profile
    const phone_number_combined = `(${phone_country_code})${phone_number}`;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: phone_number_combined,
        updated_at: new Date(),
      },
    });

    const response = UserSettingsResponseSchema.parse(updatedUser);
    return success({ response }, 'User Profile updated successfully', 200);
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
