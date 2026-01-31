import prisma from '@/lib/prisma';
import { ApplicationRoleListSchema } from '@/lib/schemas/business/server/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

export async function GET() {
  try {
    const getRoles = await prisma.role.findMany({
      where: { is_admin: false },
      select: {
        id: true,
        name: true,
      },
    });
    const roles = ApplicationRoleListSchema.parse(getRoles);

    return success({ roles }, 'Successful retrieved the application role.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/auth/role/application error:', message);
    return failure(message, 500);
  }
}
