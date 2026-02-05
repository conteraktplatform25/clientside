// src/app/api/settings/role-permission/[roleId]/permissions/route.ts
import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/errors';
import { failure } from '@/utils/response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ roleId: string }> }) {
  try {
    const { roleId } = await context.params;
    const role_id = Number(roleId);

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const role = await prisma.role.findUnique({ where: { id: role_id }, select: { name: true } });
    if (!role) return failure('Role not found', 404);

    const isEditable = role.name !== 'Business';

    const permissions = await prisma.permission.findMany({
      include: {
        roles: { where: { roleId: role_id }, select: { roleId: true } },
      },
    });

    const selected = permissions.filter((p) => p.roles.length > 0).map((p) => p.id);

    return NextResponse.json({ permissions, selected, isEditable });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/settings/business-team error:', message);
    return failure(message, 500);
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await context.params;
  if (Number.isNaN(roleId)) {
    return failure('Invalid role id', 400);
  }
  const role_id = Number(roleId);

  const user = await authenticateRequest(req);
  if (!user) return failure('Unauthorized', 401);

  const businessProfileId = user.businessProfile?.[0]?.id;
  if (!businessProfileId) return failure('Business profile not configured.', 400);

  const { permissionIds } = await req.json();

  const role = await prisma.role.findUnique({ where: { id: role_id } });
  if (!role || role.name === 'Business') {
    return NextResponse.json({ error: role ? 'Owner role not editable' : 'Role not found' }, { status: 403 });
  }

  await prisma.rolePermission.deleteMany({ where: { roleId: role_id } });

  if (permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissionIds.map((pid: number) => ({ roleId: role_id, permissionId: pid })),
    });
  }

  return NextResponse.json({ success: true });
}
