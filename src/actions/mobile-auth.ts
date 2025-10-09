import jwt from 'jsonwebtoken';
import { DecodedJWT, UserObject } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const ACCESS_TOKEN_SECRET = process.env.AUTH_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const create_access_token = (profile: UserObject): string =>
  jwt.sign({ ...profile, jti: uuidv4() }, ACCESS_TOKEN_SECRET, {
    algorithm: 'HS384',
    expiresIn: '30m', // now 15 minutes by default for dev
  });

export const create_refresh_token = (profile: UserObject): string =>
  jwt.sign({ ...profile, jti: uuidv4() }, REFRESH_TOKEN_SECRET, {
    algorithm: 'HS384',
    expiresIn: '14d', // refresh for 14 days for production
  });

export const generateTokens = (user_profile: UserObject) => {
  const access_token = create_access_token(user_profile);
  const refresh_token = create_refresh_token(user_profile);
  return { access_token, refresh_token };
};

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_TOKEN_SECRET);

export const decodeRefreshToken = (token: string) => jwt.decode(token) as DecodedJWT | null;
