// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { activateWhatsApp } from '@/lib/inngest/functions/activate-whatsapp';

export const { GET, POST } = serve({
  client: inngest,
  functions: [activateWhatsApp],
});
