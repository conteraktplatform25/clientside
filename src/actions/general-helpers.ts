import authOptions from '@/app/api/auth/[...nextauth]/authOption';
import prisma from '@/lib/prisma';
import { IServerRespone } from '@/type/server/server-response.type';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Helper to handle common error responses
export const handleError = (error: unknown, message: string, status: number = 500) => {
  console.error(message, error);
  return NextResponse.json(
    { ok: false, message: `${message}: ${error instanceof Error ? error.message : String(error)}` },
    { status }
  );
};

export const getUserBusinessID = async (): Promise<IServerRespone> => {
  const response: IServerRespone = {
    ok: false,
    message: '',
  };
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    response.message = 'Unauthorized';
    return response;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      businessProfile: true,
    },
  });
  if (!user || !user.businessProfile || user.businessProfile.length < 1) {
    response.message = 'Business profile has not been created';
    return response;
  }

  const businessProfileId = user.businessProfile[0].id;
  if (!businessProfileId) {
    response.message = 'Business profile not found for user';
    return response;
  }
  response.profile = businessProfileId;
  response.ok = true;
  response.message = 'Successful';

  return response;
};
