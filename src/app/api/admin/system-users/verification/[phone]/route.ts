import { authenticateAdminRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await context.params;
    let isExist: boolean = false;

    const user = await authenticateAdminRequest();
    if (!user) return failure('Unauthorized', 404);

    const userProfile = await prisma.user.findUnique({
      where: {
        phone,
        is_deleted: false,
      },
      select: { id: true, businessProfile: true },
    });
    if (userProfile && userProfile.businessProfile === null) isExist = true;
    return success(isExist, 'Verify Phone Number Exist', 200);
  } catch (err) {
    console.error('GET /admin/system-user/[phone] error:', err);
    return failure(getErrorMessage(err), 401);
  }
}
