import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { getErrorMessage } from '@/utils/errors';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // pusher sends form-encoded
    const params = new URLSearchParams(rawBody);

    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    if (!socket_id || !channel_name) {
      return new NextResponse('Missing socket_id or channel_name', { status: 400 });
    }

    // 1. AUTH USER (bearer token or cookie)
    const user = await authenticateRequest(req);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return new NextResponse('Business profile not configured.', { status: 403 });

    const allowed = authorizeRole(user, ['Business', 'Admin']);
    if (!allowed) return new NextResponse('Forbidden', { status: 403 });

    // 2. VERIFY CHANNEL OWNERSHIP
    const expectedChannel = `private-business-${businessProfileId}`;
    if (channel_name !== expectedChannel) {
      return new NextResponse('Forbidden: invalid channel', { status: 403 });
    }

    // 3. CORRECT AUTH METHOD
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: user.id,
      user_info: {
        business_id: businessProfileId,
      },
    });

    // 4. Return RAW BODY (NOT JSON!)
    return new NextResponse(JSON.stringify(authResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new NextResponse(getErrorMessage(err), { status: 500 });
  }
}
