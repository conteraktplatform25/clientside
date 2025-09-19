import { NextRequest, NextResponse } from 'next/server';
import { deleteNotification } from '@/utils/notification';

// DELETE /api/notifications/:id/delete
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const notif = await deleteNotification(id);
    return NextResponse.json({ ok: true, profile: notif }, { status: 200 });
  }
  return NextResponse.json({ ok: false, message: 'Failed to retrieve profile' }, { status: 400 });
}
