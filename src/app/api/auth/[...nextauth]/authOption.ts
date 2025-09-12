import CredentialsProvider from 'next-auth/providers/credentials';
import { login, refresh } from '@/actions/user-auth';
import { jwtDecode } from 'jwt-decode';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { DecodedJWT, UserObject, AuthValidity, BackendJWT } from 'next-auth';

async function refreshAccessToken(nextAuthJWT: JWT): Promise<JWT> {
  try {
    const res = await refresh(nextAuthJWT.data.tokens.refresh);
    const accessToken = await res.json();

    if (!res.ok) throw accessToken;
    const { exp }: { exp: number } = jwtDecode(accessToken.access);

    nextAuthJWT.data.validity.valid_until = exp;
    nextAuthJWT.data.tokens.access = accessToken.access;

    return { ...nextAuthJWT };
  } catch (error) {
    console.debug(error);
    return {
      ...nextAuthJWT,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'QdAt2a6P8R8wRCR2URTw+ADZOQYx0yiWNyEF70jSmdI=',
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@mail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await login(credentials?.email || '', credentials?.password || '');
          const tokens: BackendJWT = await res.json();
          if (!res.ok) throw tokens;

          // Decode tokens with explicit typing
          const access = jwtDecode<DecodedJWT>(tokens.access);
          const refresh = jwtDecode<DecodedJWT>(tokens.refresh);

          // Optional: Validate decoded token structure
          if (!access.id || !access.email || !access.role || !access.exp || !refresh.jti || !refresh.exp) {
            throw new Error('Invalid token structure');
          }

          const user: UserObject = {
            id: access.id,
            email: access.email,
            first_name: access.first_name,
            last_name: access.last_name,
            role: access.role,
          };
          const validity: AuthValidity = {
            valid_until: access.exp,
            refresh_until: refresh.exp,
          };
          return {
            id: refresh.jti,
            tokens,
            user,
            validity,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        console.debug('Initial signin');
        return { ...token, data: user };
      }

      if (Date.now() < (token.data?.validity.valid_until ?? 0) * 1000) {
        console.debug('Access token is still valid');
        return token;
      }

      if (Date.now() < (token.data?.validity.refresh_until ?? 0) * 1000) {
        console.debug('Access token is being refreshed');
        return await refreshAccessToken(token);
      }

      console.debug('Both tokens have expired');
      return { ...token, error: 'RefreshTokenExpired' };
    },
    async session({ session, token }) {
      session.user = token.data?.user;
      session.validity = token.data?.validity;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/error',
  },
};
