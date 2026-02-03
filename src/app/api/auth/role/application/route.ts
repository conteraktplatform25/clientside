import { ApplicationRoleListSchema } from '@/lib/schemas/business/server/settings.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { serviceLoadApplicationRoles } from '../serviceLoadRoles';

export async function GET() {
  try {
    const fetch_roles = await serviceLoadApplicationRoles();
    const app_roles = ApplicationRoleListSchema.parse(fetch_roles);

    return success(app_roles, 'Successfully retrieved the application role.');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/auth/role/application error:', message);
    return failure(message, 500);
  }
}
