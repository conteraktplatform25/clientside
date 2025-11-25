import { registry } from '@/lib/openapi';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const generator = new OpenApiGeneratorV31(registry.definitions);

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
        { name: 'User Settings', description: 'Endpoints related to the authenticated user' },
        { name: 'Business Owner Settings', description: 'Endpoints related to the authenticated business owner' },
        { name: 'Product Categories', description: 'Endpoints related to product categories' },
        { name: 'Products', description: 'Endpoints related to products implementation' },
        { name: 'Tags', description: 'Endpoints related to business owner tag' },
        { name: 'Contacts', description: 'Endpoints related to client contact implementation' },
        { name: 'Contact Tags', description: 'Endpoints related to client contact tag implementation' },
        { name: 'Product Orders', description: 'Endpoints related to client product order implementation' },
        { name: 'Product Order Items', description: 'Endpoints related to client product order items implementation' },
        {
          name: 'Automated Messaging - Quick Reply',
          description: 'Endpoints related to business automated messaging reply implementation',
        },
        { name: 'Inbox - Conversations', description: 'Endpoints related to client inbox conversation implementation' },
        {
          name: 'Inbox - Conversation Messages',
          description: 'Endpoints related to client inbox conversation messaging implementation',
        },
      ],
    });

    // ✅ Add Bearer Auth globally
    document = {
      ...document,
      components: {
        ...(document.components ?? {}),
        securitySchemes: {
          ...(document.components?.securitySchemes ?? {}),
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    };

    return NextResponse.json(document);
  } catch (err: unknown) {
    console.error('❌ Error generating OpenAPI document:', err);
    return NextResponse.json({ error: 'Failed to generate OpenAPI document', details: String(err) }, { status: 500 });
  }
}
