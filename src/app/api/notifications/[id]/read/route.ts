import { NextRequest, NextResponse } from 'next/server';
import { markNotificationAsRead } from '@/utils/notification';

// PATCH /api/notifications/:id/read
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const notif = await markNotificationAsRead(id);
    return NextResponse.json({ ok: true, profile: notif }, { status: 200 });
  }
  return NextResponse.json({ ok: false, message: 'Failed to retrieve profile' }, { status: 400 });
}
