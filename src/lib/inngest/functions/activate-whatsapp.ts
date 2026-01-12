// src/lib/inngest/functions/activate-whatsapp.ts
import { inngest } from '@/lib/inngest';
import prisma from '@/lib/prisma';

export const activateWhatsApp = inngest.createFunction(
  {
    id: 'activate-whatsapp',
    retries: 3,
  },
  { event: 'whatsapp/onboarding.completed' },
  async ({ event, step }) => {
    const { organizationId, wabaId, phoneNumberId, accessToken } = event.data;

    const BASE_URL = process.env.META_AI_WHATSAPP_BASEURL;
    const API_VERSION = process.env.META_AI_WHATSAPP_API_VERSION!;

    const WABA_REGISTER_ENDPOINT = `${BASE_URL}/${API_VERSION}/${phoneNumberId}/register`;
    await step.run('register-phone', async () => {
      await fetch(WABA_REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messaging_product: 'whatsapp' }),
      });
    });

    const WABA_SUBSCRIBE_WEBHOOK_ENDPOINT = `${BASE_URL}/${API_VERSION}/${wabaId}/subscribed_apps`;
    await step.run('subscribe-webhooks', async () => {
      await fetch(WABA_SUBSCRIBE_WEBHOOK_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });

    await step.run('mark-active', async () => {
      await prisma.businessProfile.update({
        where: { id: organizationId },
        data: { account_status: 'ACTIVE' },
      });
    });
  }
);
