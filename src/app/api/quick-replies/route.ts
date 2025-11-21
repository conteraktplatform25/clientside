import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  QuickReplyQuerySchema,
  QuickReplyListResponseSchema,
  CreateQuickReplyRequestSchema,
  CreateQuickReplyResponseSchema,
} from '@/lib/schemas/business/server/quickReply.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(QuickReplyQuerySchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { page, limit, search, sortBy, sortOrder } = validation.data;
    const skip = (page - 1) * limit;

    //const where: Prisma.OrderWhereInput = { businessProfileId };
    const where: Prisma.QuickReplyWhereInput = { businessProfileId };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [repliesPaginated, total] = await Promise.all([
      prisma.quickReply.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          content: true,
          isActive: true,
          variables: true,
          createdById: true,
          created_at: true,
        },
      }),
      prisma.quickReply.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const responseData = {
      pagination: { page, limit, total, totalPages },
      replies: repliesPaginated,
    };
    const quick_replies = QuickReplyListResponseSchema.parse(responseData);

    return success(quick_replies, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/quick-replies error:', err);
    return failure(message, 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(CreateQuickReplyRequestSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { title, shortcut, content, category, is_global } = validation.data;
    const responseData = await prisma.quickReply.create({
      data: {
        title,
        shortcut,
        content,
        category,
        is_global: is_global ?? false,
        businessProfileId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
      },
    });
    const quick_replies = CreateQuickReplyResponseSchema.parse(responseData);
    return success({ quick_replies }, 'Quick reply created successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/quick-replies error:', err);
    return failure(message, 401);
  }
}
