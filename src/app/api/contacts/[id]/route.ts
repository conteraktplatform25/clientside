import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ContactResponseSchema, UpdateContactSchema } from '@/lib/schemas/business/server/contacts.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const responseData = await prisma.contact.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone_number: true,
        email: true,
        whatsapp_opt_in: true,
        status: true,
        source: true,
        custom_fields: true,
        created_at: true,
        updated_at: true,
        contactTag: { select: { id: true, tag: { select: { name: true, color: true } } } },
      },
    });
    if (!responseData) return failure('Contact not found', 404);

    const contact = ContactResponseSchema.parse(responseData);

    return success({ contact }, 'Successful retrieval');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /contacts/[id] error:', err);
    return failure(message, 500);
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = UpdateContactSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { ...data } = parsed.data;

    // 3️⃣ Verify product ownership
    const existingContact = await prisma.contact.findFirst({
      where: { id, businessProfileId },
      select: { id: true },
      //include: { tags: true },
    });
    if (!existingContact) return failure('Contact profile not found.', 404);

    // Update contact info
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name: data.name,
        phone_number: data.phone_number,
        email: data.email,
        whatsapp_opt_in: data.whatsapp_opt_in,
        custom_fields: data.custom_fields,
        updated_at: new Date(),
      },
    });

    // Update tags (optional)
    // if (data.tags && Array.isArray(data.tags)) {
    //   await prisma.contactTag.deleteMany({ where: { contactId: id } });
    //   await prisma.contactTag.createMany({
    //     data: data.tags.map((t) => ({
    //       name: t.name,
    //       color: t.color,
    //       contactId: id,
    //     })),
    //   });
    // }

    return success({ updatedContact }, 'Contact Profile updated successfully', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('PATCH /contacts/[id] error:', err);
    return failure(message, 401);
  }
}
