// src/app/api/notification/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { countUnreadNotifications, getUserNotifications } from '@/utils/notification';

export async function GET(req: NextRequest) {
  //const user = await getUserFromRequest(req);
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const notifications = await getUserNotifications(user.id, limit, offset);
  const unreadCount = await countUnreadNotifications(user.id);

  return NextResponse.json({ ok: true, profile: { notifications, unreadCount } }, { status: 200 });
}
