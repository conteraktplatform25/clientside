// src/app/api/notification/read/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { markAllNotificationsAsRead } from '@/utils/notification';
import { success } from '@/utils/response';

// PATCH /api/notifications/read
export async function PATCH(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

  const result = await markAllNotificationsAsRead(user.id);
  return success({ updated: result.count });
}
