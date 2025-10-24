import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    if (!authorizeRole(user, ['Business'])) return failure('Forbidden: Insufficient permissions', 403);

    if (user.businessProfile.length === 0 || !user.businessProfile[0].id)
      return failure('Whatsapp Profile has not been configured.', 404);

    const businessProfileId = user.businessProfile[0].id;

    const count = await prisma.product.count({
      where: { businessProfileId },
    });
    return success({ count }, 'Product count retrieved successfully');
  } catch (err) {
    return failure(getErrorMessage(err), 401);
  }
}
