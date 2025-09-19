import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { countUnreadNotifications } from '@/utils/notification';

// GET /api/notifications/count
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: 'UNAUTHORIZED' }, { status: 401 });

  const count = await countUnreadNotifications(user?.id);
  return NextResponse.json({ ok: true, profile: count }, { status: 200 });
}
