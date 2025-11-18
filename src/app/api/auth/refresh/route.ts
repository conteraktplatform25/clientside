import { create_access_token, decodeRefreshToken, verifyRefreshToken } from '@/actions/mobile-auth';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { BackendJWT, UserObject } from 'next-auth';

export async function POST(req: Request) {
  const { refresh_token } = await req.json();
  if (!refresh_token) return failure('Missing refresh token');

  try {
    // will throw if invalid
    verifyRefreshToken(refresh_token);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/refresh error:', err);
    return failure(message, 500);
  }
  // produce a new access token
  const decodedUser = decodeRefreshToken(refresh_token);
  if (!decodedUser) {
    return failure('Invalid token.', 401);
  }

  const profile: UserObject = {
    id: decodedUser.id,
    email: decodedUser.email,
    first_name: decodedUser.first_name,
    last_name: decodedUser.last_name,
    role: decodedUser.role,
    phone_number: decodedUser.phone_number,
    registered_number: decodedUser.registered_number,
  };

  const new_access: BackendJWT = {
    access: create_access_token(profile),
    refresh: refresh_token, // keep same refresh for demo
  };

  return success(new_access, 'Successful Refreshed Token');
}
