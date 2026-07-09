import { decodeJwt } from 'jose';

export function isTokenExpired(
  token: string,
  bufferInSeconds = 60,
): boolean {
  try {
    const { exp } = decodeJwt(token);

    if (!exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);

    return exp <= now + bufferInSeconds;
  } catch {
    return true;
  }
}