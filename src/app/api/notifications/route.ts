import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { countUnreadNotifications, getUserNotifications } from '@/utils/notification';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const notifications = await getUserNotifications(user.id, limit, offset);
  const unreadCount = await countUnreadNotifications(user.id);

  return NextResponse.json({ ok: true, profile: { notifications, unreadCount } }, { status: 200 });
}

// export async function name(req: NextRequest) {
//   const user = await getUserFromRequest(req);
//   if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

//   const payload = await req.json();

//   if (payload.action === 'markAllRead') {
//     await prisma.applicationNotification.updateMany({
//       where: { recipientId: user.id, isDeleted: false, isRead: false },
//       data: { isRead: true },
//     });
//     return NextResponse.json({ ok: true }, { status: 200 });
//   }

//   if (payload.action === 'markRead' && payload.id) {
//     const notif = await prisma.applicationNotification.update({
//       where: { id: payload.id },
//       data: { isRead: true },
//     });
//     return NextResponse.json({ ok: true, notification: notif }, { status: 200 });
//   }

//   return NextResponse.json({ ok: false, message: 'BAD REQUEST' }, { status: 400 });
// }
