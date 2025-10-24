import { NextRequest } from 'next/server';
import prisma from './prisma';
import { hash } from 'bcryptjs';
import { getServerSession, UserObject } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/authOption';
import { AuthenticatedUser } from '@/type/server/authentication.type';
import { verifyAccessToken } from '@/actions/mobile-auth';

export async function registerUser({
  first_name,
  last_name,
  email,
  password,
}: {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({ data: { first_name, last_name, email, password: hashed, roleId: 1 } });
  return user;
}

export async function getUserFromRequest(req: NextRequest | Request) {
  const userId = req.headers && req.headers.get && req.headers.get('x-user-id');
  console.log('Request Header:', userId);
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export function requireServiceKey(req: Request) {
  const key = req.headers.get('x-service-key');
  return key === process.env.INTERNAL_SERVICE_KEY;
}

export async function authenticateRequest(req: NextRequest): Promise<AuthenticatedUser | null> {
  // 1️⃣ Try NextAuth
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true, businessProfile: true },
    });
    return user as AuthenticatedUser | null;
  }

  // 2️⃣ Try Bearer token
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      //const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      const decoded = verifyAccessToken(token) as UserObject;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { role: true, businessProfile: true },
      });
      return user as AuthenticatedUser | null;
    } catch (err) {
      console.error('JWT error:', err);
      return null;
    }
  }

  // 3️⃣ No valid auth
  return null;
}

export function authorizeRole(user: AuthenticatedUser | null, allowed: string[]): boolean {
  const user_role = user && user.role && user.role.name;
  return !!user && allowed.includes(user_role!);
}
