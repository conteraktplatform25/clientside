import { registry } from '@/lib/openapi';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const generator = new OpenApiGeneratorV31(registry.definitions);

    // Generate the base document
    let document = generator.generateDocument({
      openapi: '3.1.0',
      info: {
        title: 'Contakt Server API',
        version: '1.0.0',
        description: 'API documentation for Contakt Commerce platform',
      },
      servers: [{ url: process.env.NEXT_PUBLIC_APP_URL! }],
      tags: [
        {
          name: 'Authentication',
          description: 'Endpoints related to user authentication, OAuth, session management, and profile updates',
        },
        {
          name: 'Product Categories',
          description: 'Endpoints related to product categories',
        },
      ],
    });

    // ✅ Merge components safely to add bearerAuth
    document = {
      ...document,
      components: {
        ...(document.components || {}),
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };

    return NextResponse.json(document);
  } catch (err: unknown) {
    console.error('❌ Error generating OpenAPI document:', err);
    return NextResponse.json({ error: 'Failed to generate OpenAPI document', details: String(err) }, { status: 500 });
  }
}
