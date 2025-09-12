// import NextAuth, { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from '@/lib/prisma'; // create prisma client
// import { compare } from 'bcryptjs';

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });
//         if (!user) return null;

//         const isValid = user && user.password ? await compare(credentials.password, user.password) : false;
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           first_name: user.first_name,
//           last_name: user.last_name,
//           email: user.email,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt', // ✅ typed literal
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
