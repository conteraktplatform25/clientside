import { z } from 'zod';
import { NextRequest } from 'next/server';
import { getErrorMessage } from '@/utils/errors';

/**
 * Validate and parse a Next.js Request using a Zod schema.
 * If validation fails, returns a formatted 400 error response.
 */
export async function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  req: NextRequest
): Promise<{ success: true; data: z.infer<T> } | { success: false; response: string }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return {
        success: false,
        response: getErrorMessage(issues),
      };
    }

    return {
      success: false,
      response: 'Invalid request',
    };
  }
}
