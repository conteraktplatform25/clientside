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
    let data: unknown;
    // GET requests → extract query params
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const query = Object.fromEntries(url.searchParams.entries());
      data = query;
    } else {
      // POST/PUT/PATCH → parse JSON body
      data = await req.json();
    }
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
    // const body = await req.json();
    // const data = schema.parse(body);
    //return { success: true, data };
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('POST /api/contacts error:', message);
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
