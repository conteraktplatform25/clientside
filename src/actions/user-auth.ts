// src/actions/user-auth.ts
import type { UserObject, BackendJWT } from 'next-auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getErrorMessage } from '@/utils/errors';
import { NextResponse } from 'next/server';
import type { DecodedJWT } from 'next-auth';

// find user by email and validate password (you had this)
const RequestLogin = async (email: string, password: string): Promise<UserObject> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true, businessProfile: true },
  });
  if (!user || !user.password) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  if (!user.is_activated) throw new Error('Account not verified.');

  const profile: UserObject = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role.name,
  };
  return profile;
};

const secret_signing_salt = process.env.AUTH_SECRET || 'super-secret-salt';

export async function login(email: string, password: string): Promise<Response> {
  const profile = await RequestLogin(email, password);

  const mock_data: BackendJWT = {
    access: create_access_token(profile),
    refresh: create_refresh_token(profile),
  };

  return new Response(JSON.stringify(mock_data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function refresh(token: string): Promise<Response> {
  if (!token) throw new Error('Token required');

  try {
    // will throw if invalid
    jwt.verify(token, secret_signing_salt);
  } catch (err) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 401 });
  }

  // produce a new access token (for test/demo return a token with longer expiry)
  const decoded = jwt.decode(token) as DecodedJWT | null;
  if (!decoded) {
    throw new Error('Invalid token');
  }
  const profile: UserObject = {
    id: decoded.id,
    email: decoded.email,
    first_name: decoded.first_name ?? null,
    last_name: decoded.last_name ?? null,
    role: decoded.role ?? 'Business',
  };

  const new_access: BackendJWT = {
    access: create_access_token(profile),
    refresh: token, // keep same refresh for demo
  };

  return new Response(JSON.stringify(new_access), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const create_access_token = (profile: UserObject): string =>
  jwt.sign({ ...profile, jti: uuidv4() }, secret_signing_salt, {
    algorithm: 'HS384',
    expiresIn: '10m', // now 10 minutes by default for dev
  });

const create_refresh_token = (profile: UserObject): string =>
  jwt.sign({ ...profile, jti: uuidv4() }, secret_signing_salt, {
    algorithm: 'HS384',
    expiresIn: '7d', // refresh for 7 days for testing/demo
  });
