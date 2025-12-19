// src/app/api/[...nextauth]/authOption.ts
//import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';
import { login, refresh } from '@/actions/user-auth';
import { PrismaClient } from '@prisma/client';
import { Adapter, AdapterUser } from 'next-auth/adapters';

// ⛔ TURN OFF automatic user creation by the PrismaAdapter for OAuth
import { PrismaAdapter } from '@auth/prisma-adapter';
const BaseAdapter = PrismaAdapter(prisma);

type BackendJWT = import('next-auth').BackendJWT;
type DecodedJWT = import('next-auth').DecodedJWT;
type CredentialsUser = import('next-auth').CredentialsUser;
type UserObject = import('next-auth').UserObject;
type AuthValidity = import('next-auth').AuthValidity;

interface GoogleProfile {
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

const ROLE_REDIRECTS: Record<string, string> = {
  Admin: '/admin',
  Business: '/',
  Agent: '/agent',
};

async function refreshAccessToken(nextAuthJWT: NextAuthJWT): Promise<NextAuthJWT> {
  try {
    const refreshToken = nextAuthJWT.data?.tokens?.refresh;
    if (!refreshToken) throw new Error('No refresh token available');

    const res = await refresh(refreshToken);
    const accessPayload = await res.json();
    if (!res.ok) throw accessPayload;

    const decoded = jwtDecode<DecodedJWT>(accessPayload.access);
    const exp = decoded.exp ?? 0;

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
          access: accessPayload.access,
        },
      },
      error: undefined,
    };
  } catch (err) {
    console.error('refreshAccessToken error', err);
    return {
      ...nextAuthJWT,
      error: 'RefreshAccessTokenError',
    };
  }
}
/**
 * Custom Prisma Adapter
 *
 * Important behavior:
 *  - When NextAuth asks to create a user (OAuth flow), we create the user but set
 *    is_activated = false by default (so users signing up with Google are NOT auto-activated).
 *  - We return the shape NextAuth expects for AdapterUser.
 */
function CustomPrismaAdapter(p: PrismaClient): Adapter {
  //const base = PrismaAdapter(p);

  return {
    ...BaseAdapter,
    // override createUser to ensure `is_activated` default and mapping of names
    async createUser(data: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      // Ensure default role exists or create it
      let defaultRole = await p.role.findFirst({ where: { name: 'Business' } });
      if (!defaultRole) {
        defaultRole = await p.role.create({ data: { name: 'Business', is_default: true, is_admin: false } });
      }

      // Map name string into first/last
      const [firstName, ...rest] = (data.name ?? '').split(' ');
      const lastName = rest.join(' ') || null;

      // Determine email verified date if provided
      let emailVerifiedDate = null;
      if (data.emailVerified) {
        try {
          emailVerifiedDate = new Date(data.emailVerified as unknown as string);
          if (Number.isNaN(emailVerifiedDate.getTime())) emailVerifiedDate = null;
        } catch {
          emailVerifiedDate = null;
        }
      }

      const created = await p.user.create({
        data: {
          email: data.email ?? '',
          first_name: firstName || null,
          last_name: lastName,
          image: data.image ?? null,
          is_activated: false,
          email_verified_date: emailVerifiedDate,
          role: { connect: { id: defaultRole.id } },
        },
      });
      return {
        id: created.id,
        name: `${created.first_name ?? ''} ${created.last_name ?? ''}`.trim(),
        email: created.email,
        image: created.image,
        emailVerified: created.email_verified_date,
      };
    },
    async getUser(id) {
      const user = await p.user.findUnique({
        where: { id },
        include: { role: true },
      });
      if (!user) return null;

      return {
        id: user.id,
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
        email: user.email,
        image: user.image,
        emailVerified: user.email_verified_date,
      };
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: { params: { scope: 'openid email profile' } },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const res = await login(credentials.email, credentials.password);
        const tokens = (await res.json()) as BackendJWT;
        if (!res.ok) throw new Error('Invalid credentials');

        const accessDecoded = jwtDecode<DecodedJWT>(tokens.access);
        const refreshDecoded = jwtDecode<DecodedJWT>(tokens.refresh!);

        const profile = await prisma.businessProfile.findFirst({
          where: { userId: accessDecoded.id },
          select: { id: true, business_number: true, phone_number: true },
        });

        const user: UserObject = {
          id: accessDecoded.id,
          email: accessDecoded.email,
          first_name: accessDecoded.first_name,
          last_name: accessDecoded.last_name,
          role: accessDecoded.role,
          phone_number: profile?.phone_number,
          businessProfileId: profile?.id,
          registered_number: profile?.business_number ?? '',
          is_activated: accessDecoded.is_activated,
        };

        const validity: AuthValidity = {
          valid_until: accessDecoded.exp,
          refresh_until: refreshDecoded.exp,
        };

        const credentialsUser: CredentialsUser = {
          id: refreshDecoded.jti,
          user,
          validity,
          tokens,
        };

        return credentialsUser as unknown as NextAuthUser;
      },
    }),
  ],
  // Custom pages if you have them
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    /**
     * signIn callback:
     * - This runs during sign-in. We use it to:
     *   1) ensure Google users are not fully allowed to sign-in if their user record is not activated
     *   2) redirect new/inactive Google users to /get-profile to complete activation
     *
     * Returning `true` continues login; returning `false` blocks; returning a string redirects.
     */
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          const email = (user as NextAuthUser).email ?? null;
          if (!email) {
            // we require email
            return false;
          }

          // Find the DB user (the adapter may have already created them)
          const dbUser = await prisma.user.findUnique({
            where: { email },
          });

          const full_name = (profile as GoogleProfile)?.name;

          // If user doesn't exist for some reason, create them as inactive (defensive)
          if (!dbUser) {
            const [first_name, ...rest] = full_name?.split(' ') ?? [];
            const last_name = rest.join(' ') || null;
            let defaultRole = await prisma.role.findFirst({ where: { name: 'Business' } });
            if (!defaultRole) {
              defaultRole = await prisma.role.create({ data: { name: 'Business', is_default: true, is_admin: false } });
            }
            await prisma.user.create({
              data: {
                email,
                first_name: first_name ?? null,
                last_name,
                image: (profile as GoogleProfile)?.picture ?? null,
                is_activated: false,
                role: { connect: { id: defaultRole.id } },
              },
            });

            return `/profile?verified=true&email=${user.email}&name=${full_name}`;
          }
          // If user exists but not activated -> redirect to profile completion
          if (!dbUser.is_activated) {
            return `/profile?verified=true&email=${user.email}&name=${full_name}`;
          }
        }
        // default: allow
        return true;
      } catch (err) {
        console.error('signIn callback error', err);
        return false;
      }
    },

    /**
     * jwt callback — unify shape for credentials & oauth
     */
    async jwt({ token, user, account }) {
      const nextToken: NextAuthJWT = { ...(token as NextAuthJWT) };

      // INITIAL SIGN IN
      if (user && account) {
        // Credentials provider returns a custom object in authorize()
        if (account.provider === 'credentials') {
          const creds = user as unknown as CredentialsUser;
          nextToken.data = {
            user: creds.user,
            validity: creds.validity,
            tokens: creds.tokens,
            redirectTo: ROLE_REDIRECTS[creds.user.role] ?? '/',
          };
          nextToken.error = undefined;
          return nextToken;
        }

        // OAuth (Google)
        // user is the Adapter-created user (basic fields). We want richer info from DB.
        const oauthUser = user as NextAuthUser;
        // fetch full DB record to get role + is_activated + business profile
        const dbUser = await prisma.user.findUnique({
          where: { id: oauthUser.id as string },
          include: { role: true },
        });

        const appUser: Partial<UserObject> = {
          id: dbUser?.id ?? (oauthUser.id as string),
          email: oauthUser.email ?? undefined,
          first_name: dbUser?.first_name ?? oauthUser.name?.split(' ')[0] ?? undefined,
          last_name: dbUser?.last_name ?? oauthUser.name?.split(' ').slice(1).join(' ') ?? undefined,
          image: oauthUser.image ?? null,
          role: dbUser?.role?.name ?? 'Business',
          // include activation flag for middleware/UI
          is_activated: dbUser?.is_activated ?? false,
        };

        nextToken.data = {
          user: appUser as UserObject,
          validity: { valid_until: 0, refresh_until: 0 },
          tokens: undefined,
          redirectTo: ROLE_REDIRECTS[appUser.role!] ?? '/',
        };
        nextToken.error = undefined;
        return nextToken;
      }
      // Subsequent requests: if we have validity from credentials flow, handle refresh
      if (nextToken.data?.validity && typeof nextToken.data.validity === 'object') {
        const v = nextToken.data.validity as AuthValidity;
        if (v.valid_until && Date.now() < v.valid_until * 1000) {
          return nextToken;
        }
        if (v.refresh_until && Date.now() < v.refresh_until * 1000) {
          return await refreshAccessToken(nextToken);
        }
        nextToken.error = 'RefreshTokenExpired';
        return nextToken;
      }

      return nextToken;
    },

    async session({ session, token }) {
      if (token?.data?.user) {
        const user = token.data.user;
        session.user = {
          id: user.id,
          email: user.email,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          businessProfileId: user.businessProfileId ?? null,
          image: user.image ?? null,
          role: typeof user.role === 'string' ? user.role : (user.role ?? 'Business'),
          is_activated: user.is_activated ?? false,
          registered_number: user.registered_number ?? undefined,
        };
      } else {
        // fallback to defaults coming from token
        session.user = {
          id: token.sub ?? '',
          email: token.email ?? '',
          first_name: token.name?.split(' ')[0] ?? null,
          last_name: token.name?.split(' ').slice(1).join(' ') ?? null,
          image: token.picture ?? null,
          role: token.role ?? 'Business',
          is_activated: false,
        };
      }

      session.validity = token?.data?.validity ?? {};
      session.error = token?.error;
      session.redirectTo = token?.data?.redirectTo ?? ROLE_REDIRECTS[session.user.role] ?? '/';

      return session;
    },

    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith('/api/auth')) return baseUrl;
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        const target = new URL(url);
        if (target.origin === baseUrl) return url;
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
};
