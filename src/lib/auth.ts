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
