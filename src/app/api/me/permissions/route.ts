import { authenticateRequest, getUserPermissions } from '@/lib/auth';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const permissions = await getUserPermissions(user.id, businessProfileId);
    return success(permissions, 'Successfully retrieved permissions');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/me/permissions error:', message);
    return failure(message, 500);
  }
}
