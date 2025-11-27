// src/app/api/[...nextauth]/authOption.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';
import { login, refresh } from '@/actions/user-auth';
import { PrismaClient } from '@prisma/client';
import { Adapter, AdapterUser } from 'next-auth/adapters';

// keep your custom types in next-auth.d.ts
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
  email?: string;
}

// ==========================================
// 🔹 Role-based redirect mapping
// ==========================================
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

    // decode the new access for expiry (`exp` as seconds)
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

function CustomPrismaAdapter(p: PrismaClient): Adapter {
  // ✅ type parameter
  const base = PrismaAdapter(p);

  return {
    ...base,
    async createUser(data: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      // Ensure default "Business" role exists
      const defaultRole = await p.role.findFirst({
        where: { name: 'Business' },
      });

      if (!defaultRole) {
        throw new Error('Default role "Business" not found in database');
      }

      // 🔹 Map NextAuth's `name` → `first_name` / `last_name`
      const [firstName, ...rest] = (data.name ?? '').split(' ');
      const lastName = rest.join(' ') || null;
      // 🔹 Create your User with your own field names
      const created = await p.user.create({
        data: {
          email: data.email ?? '',
          first_name: firstName || null,
          last_name: lastName,
          image: data.image ?? null,
          email_verified_date: new Date() ?? null,
          is_activated: true,
          role: { connect: { id: defaultRole.id } },
        },
      });

      // 🔹 Return the shape NextAuth expects
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

        // `login` returns a Response containing BackendJWT (access & refresh)
        const res = await login(credentials.email, credentials.password);
        const tokens = (await res.json()) as BackendJWT;
        if (!res.ok) throw new Error('Invalid credentials');

        // decode tokens to extract user info and expiry
        const accessDecoded = jwtDecode<DecodedJWT>(tokens.access);
        const refreshDecoded = jwtDecode<DecodedJWT>(tokens.refresh!);

        // find business profile if you need extra fields
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
        };

        const validity: AuthValidity = {
          valid_until: accessDecoded.exp,
          refresh_until: refreshDecoded.exp,
        };

        // IMPORTANT: The object returned here becomes `user` in the jwt callback
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
  callbacks: {
    // preserve callbackUrl when present; otherwise default to baseUrl
    async redirect({ url, baseUrl }) {
      try {
        // 1️⃣ Always allow NextAuth's internal URLs
        if (url.startsWith('/api/auth')) return baseUrl;

        // 2️⃣ If it's a relative callback URL (like `/dashboard`), return it
        if (url.startsWith('/')) return `${baseUrl}${url}`;

        // 3️⃣ Same-origin absolute URLs
        const target = new URL(url);
        if (target.origin === baseUrl) return url;

        // 4️⃣ Fallback
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },

    // jwt callback — unify data shape for both providers
    async jwt({ token, user, account, profile }) {
      // token: existing JWT between calls
      // user: present only on initial sign-in
      const nextToken: NextAuthJWT = { ...(token as NextAuthJWT) };

      // INITIAL SIGN IN
      if (user && account) {
        // Credentials provider returned a custom object via authorize()
        if (account.provider === 'credentials') {
          // The CredentialsProvider returns a custom user-like object in authorize.
          // We stored that as `user` so cast it.
          const creds = user as unknown as CredentialsUser;
          nextToken.data = {
            user: creds.user,
            validity: creds.validity,
            tokens: creds.tokens,
          };
          nextToken.data.redirectTo = ROLE_REDIRECTS[creds.user.role] ?? '/';
          nextToken.error = undefined;
          return nextToken;
        }

        // OAuth provider (google)
        // `user` here is the NextAuth user (created by Prisma adapter)
        // map to your application UserObject consistently
        const oauthUser = user as NextAuthUser;
        const googleProfile = profile as GoogleProfile;
        // Build a safe app user shape
        const appUser: Partial<UserObject> = {
          id: oauthUser.id as string,
          email: oauthUser.email ?? undefined,
          first_name: googleProfile.given_name ?? oauthUser.name?.split(' ')[0] ?? undefined,
          last_name: googleProfile.family_name ?? oauthUser.name?.split(' ').slice(1).join(' ') ?? undefined,
          image: oauthUser.image ?? null,
          role: 'Business', // default role name; you may want to look up actual role from DB if needed
        };

        nextToken.data = {
          user: appUser as UserObject,
          validity: { valid_until: 0, refresh_until: 0 }, // placeholders (no backend tokens available)
          tokens: undefined,
          redirectTo: ROLE_REDIRECTS[appUser.role!] ?? '/',
        };
        nextToken.error = undefined;
        return nextToken;
      }

      // NOT initial sign-in: check token validity if we stored validity/tokens (credentials flow)
      if (nextToken.data?.validity && typeof nextToken.data.validity === 'object') {
        const v = nextToken.data.validity as AuthValidity;
        // if access still valid
        if (v.valid_until && Date.now() < v.valid_until * 1000) {
          return nextToken;
        }
        // if refresh still valid, attempt refresh
        if (v.refresh_until && Date.now() < v.refresh_until * 1000) {
          return await refreshAccessToken(nextToken);
        }
        // expired
        nextToken.error = 'RefreshTokenExpired';
        return nextToken;
      }

      // fallback: return token unchanged
      return nextToken;
    },

    // session: expose a stable session.user shape client-side
    async session({ session, token }) {
      if (token?.data?.user) {
        const user = token.data.user;
        // Handle Prisma nested role object
        session.user = {
          id: user.id,
          email: user.email,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          businessProfileId: user.businessProfileId ?? null,
          image: user.image ?? null,
          role: typeof user.role === 'string' ? user.role : (user.role ?? 'Business'), // flatten role object
        };
      } else {
        // --- 2️⃣ Fallback to NextAuth defaults (e.g., Google) ---
        session.user = {
          id: token.sub ?? '',
          email: token.email ?? '',
          first_name: token.name?.split(' ')[0] ?? null,
          last_name: token.name?.split(' ').slice(1).join(' ') ?? null,
          image: token.picture ?? null,
          businessProfileId: token.data.user?.businessProfileId ?? null,
          role: 'Business',
        };
      }

      session.validity = token?.data?.validity ?? {};
      session.error = token?.error;

      const role = session.user.role;
      session.redirectTo = ROLE_REDIRECTS[role] ?? '/';

      return session;
    },
  },

  // custom pages
  pages: {
    signIn: '/login',
    error: '/error',
  },

  // debug helpful while developing
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
