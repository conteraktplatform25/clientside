import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthValidity, BackendJWT, CredentialsUser, DecodedJWT, NextAuthOptions, UserObject } from 'next-auth';
import { jwtDecode } from 'jwt-decode';
import { login, refresh } from '@/actions/user-auth';
import { JWT } from 'next-auth/jwt';

const prisma = new PrismaClient();

async function refreshAccessToken(nextAuthJWT: JWT): Promise<JWT> {
  try {
    if (!nextAuthJWT.data?.tokens?.refresh) {
      throw new Error('No refresh token available');
    }
    const res = await refresh(nextAuthJWT.data.tokens.refresh);
    const accessToken = await res.json();

    if (!res.ok) throw accessToken;
    const { exp }: { exp: number } = jwtDecode(accessToken.access);

    return {
      ...nextAuthJWT,
      data: {
        ...nextAuthJWT.data,
        validity: {
          ...nextAuthJWT.data.validity,
          valid_until: exp,
        },
        tokens: {
          ...nextAuthJWT.data.tokens,
          access: accessToken.access,
        },
      },
      error: undefined,
    };
  } catch (error) {
    console.debug(error);
    return {
      ...nextAuthJWT,
      data: {
        ...nextAuthJWT.data,
        user: nextAuthJWT.data.user || null,
        validity: nextAuthJWT.data.validity || { valid_until: 0, refresh_until: 0 },
        tokens: nextAuthJWT.data.tokens || { access: '', refresh: '' },
      },
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'QdAt2a6P8R8wRCR2URTw+ADZOQYx0yiWNyEF70jSmdI=',
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@mail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        console.log('Just Testing');

        if (typeof email !== 'string' || typeof password !== 'string') {
          throw new Error('Email and password must be provided as strings');
        }

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        try {
          const res = await login(email, password);
          const tokens: BackendJWT = await res.json();
          if (!res.ok) throw new Error('Invalid credentials');

          const access = jwtDecode<DecodedJWT>(tokens.access);
          const refresh = jwtDecode<DecodedJWT>(tokens.refresh);

          console.log('JWT Access Here', access);

          if (!access.id || !access.email || !access.role || !access.exp || !refresh.jti || !refresh.exp) {
            throw new Error('Invalid token structure');
          }

          const roleRecord = await prisma.role.findUnique({
            where: { name: access.role },
          });
          if (!roleRecord) {
            throw new Error(`Role '${access.role}' not found in database`);
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

          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              first_name: user.first_name,
              last_name: user.last_name,
              roleId: roleRecord.id,
              is_activated: true,
            },
            create: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              roleId: roleRecord.id,
              is_activated: true,
              is_deleted: false,
            },
          });

          return {
            id: refresh.jti,
            user,
            validity,
            tokens,
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
    async jwt({ token, user, account, profile }): Promise<JWT> {
      // Initialize token to match JWT interface
      const initializedToken: JWT = {
        ...token,
        data: token.data || { user: null, validity: {}, tokens: undefined },
        error: token.error,
      };
      if (user && account) {
        console.debug('Initial signin');
        if (account.provider === 'google') {
          const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });
          const roleRecord = await prisma.role.findUnique({ where: { name: 'Business' } });
          const roleId = roleRecord?.id || 1;
          const roleName = roleRecord?.name || 'Business';

          if (existingUser) {
            // Link Google account to existing user if not already linked
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: 'google',
                providerAccountId: account.providerAccountId,
              },
            });
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  provider: 'google',
                  type: 'OAuth',
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
          } else {
            // Create new user
            await prisma.user.create({
              data: {
                id: user.id!,
                email: user.email!,
                first_name: (profile as GoogleProfile)?.given_name || null,
                last_name: (profile as GoogleProfile)?.family_name || null,
                image: user.image || null,
                roleId,
                is_activated: true,
                is_deleted: false,
              },
            });

            // Create account entry
            await prisma.account.create({
              data: {
                userId: user.id!,
                provider: 'google',
                type: 'OAuth',
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
          // For Google provider, return a valid User object
          // Since Google doesn't provide tokens like your Credentials provider,
          // you can either omit tokens or generate them via your backend
          return {
            ...initializedToken,
            data: {
              user: {
                id: user.id!,
                email: user.email!,
                first_name: (profile as GoogleProfile)?.given_name || null,
                last_name: (profile as GoogleProfile)?.family_name || null,
                image: user.image || null,
                role: existingUser
                  ? (await prisma.role.findUnique({ where: { id: existingUser.roleId } }))?.name || roleName
                  : roleName,
              },
              validity: { valid_until: 0, refresh_until: 0 }, // Placeholder; adjust based on your logic
              tokens: { access: '', refresh: '' }, // Placeholder; integrate with backend if needed
            },
            error: undefined,
          };
        }
        // Credentials provider
        const credentialsUser = user as CredentialsUser;
        return {
          ...initializedToken,
          data: {
            user: credentialsUser.user,
            validity: credentialsUser.validity,
            tokens: credentialsUser.tokens,
          },
          error: undefined,
        };
      }
      if (
        initializedToken.data.validity &&
        'valid_until' in initializedToken.data.validity &&
        initializedToken.data.validity.valid_until &&
        Date.now() < initializedToken.data.validity.valid_until * 1000
      ) {
        console.debug('Access token is still valid');
        return { ...initializedToken, error: undefined };
      }

      if (
        initializedToken.data.validity &&
        'refresh_until' in initializedToken.data.validity &&
        initializedToken.data.validity.refresh_until &&
        Date.now() < initializedToken.data.validity.refresh_until * 1000
      ) {
        console.debug('Access token is being refreshed');
        return await refreshAccessToken(initializedToken);
      }

      console.debug('Both tokens have expired');
      return { ...initializedToken, error: 'RefreshTokenExpired' };
    },
    async session({ session, token }) {
      session.user = token.data?.user;
      session.validity = token.data?.validity;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
};

export default authOptions;
