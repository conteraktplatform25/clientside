import { NextRequest } from 'next/server';
import prisma from './prisma';
import { hash } from 'bcryptjs';

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
