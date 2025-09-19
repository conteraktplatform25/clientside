import type { Profile, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Core user object stored in our database.
   */
  export interface UserObject {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    image?: string | null;
    phone_number?: string | null;
    registered_number?: string;
  }

  /**
   * Tokens returned by our backend.
   */
  export interface BackendJWT {
    access: string;
    refresh: string;
  }

  /**
   * Decoded contents of access/refresh tokens.
   */
  export interface DecodedJWT extends UserObject {
    token_type: 'refresh' | 'access';
    exp: number;
    iat: number;
    jti: string;
  }

  /**
   * Expiration data from decoded tokens.
   */
  export interface AuthValidity {
    valid_until: number;
    refresh_until: number;
  }

  /**
   * User returned from CredentialsProvider `authorize`.
   */
  export interface CredentialsUser {
    id: string;
    user: UserObject;
    validity: AuthValidity;
    tokens: BackendJWT;
  }

  /**
   * Returned by `useSession`, `getSession`, and the `session` callback.
   */
  export interface Session {
    user: UserObject | null;
    validity: AuthValidity | object;
    error?: 'RefreshTokenExpired' | 'RefreshAccessTokenError';
  }

  /**
   * Extend Google profile with optional names.
   */
  export interface GoogleProfile extends Profile {
    given_name?: string;
    family_name?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Shape of the JWT stored in cookies / returned by `jwt` callback.
   */
  export interface JWT {
    data: {
      user: import('next-auth').UserObject | null;
      validity: import('next-auth').AuthValidity | object;
      tokens?: import('next-auth').BackendJWT;
    };
    error?: 'RefreshTokenExpired' | 'RefreshAccessTokenError';
  }
}
