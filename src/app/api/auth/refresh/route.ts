import { create_access_token, decodeRefreshToken, verifyRefreshToken } from '@/actions/mobile-auth';
import { getErrorMessage } from '@/utils/errors';
import { BackendJWT, UserObject } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { refresh_token } = await req.json();
  if (!refresh_token) return NextResponse.json({ ok: false, message: 'Missing refresh token' }, { status: 400 });

  try {
    // will throw if invalid
    verifyRefreshToken(refresh_token);
  } catch (err) {
    return NextResponse.json({ ok: false, error: getErrorMessage(err) }, { status: 401 });
  }
  // produce a new access token
  const decodedUser = decodeRefreshToken(refresh_token);
  if (!decodedUser) {
    return NextResponse.json({ ok: false, message: 'Invalid token.' }, { status: 401 });
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

  return NextResponse.json(
    { ok: true, data: JSON.stringify(new_access), message: 'Successful Refreshed Token' },
    { status: 200 }
  );
}
