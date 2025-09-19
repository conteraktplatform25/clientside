import { NextResponse } from 'next/server';
import { requireServiceKey } from '@/lib/auth';
import { createAppNotification } from '@/utils/notification';

export async function POST(req: Request) {
  if (!requireServiceKey(req)) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

  const body = await req.json();
  const notif = await createAppNotification({
    recipientId: body.recipientId,
    senderId: body.senderId,
    type: body.type,
    title: body.title,
    body: body.body,
    data: body.data,
    channel: body.channel,
  });

  return NextResponse.json({ ok: true, profile: notif }, { status: 200 });
}
