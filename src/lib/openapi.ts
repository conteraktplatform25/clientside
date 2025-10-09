import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerFormSchema } from './schemas/auth/signup.schema';
import { profileFormSchema } from './schemas/auth/profile.schema';
import { resetPasswordFormSchema } from './schemas/auth/resetpassword.schema';
import { z } from 'zod';
import {
  loginRequestSchema,
  loginResponseSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
} from './schemas/auth/nextauth-openapi.schema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// ✅ Initialize zod-openapi
extendZodWithOpenApi(z);

// Create a central registry
export const registry = new OpenAPIRegistry();

// --------------------------------------
// Register Common Schemas
// --------------------------------------
const successResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string().optional(),
});

const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.union([z.string(), z.any()]),
});

registry.register('SuccessResponse', successResponseSchema);
registry.register('ErrorResponse', errorResponseSchema);

/* ===========================
   REGISTER SCHEMAS
=========================== */
registry.register('LoginRequest', loginRequestSchema);
registry.register('LoginRequest', loginResponseSchema);
// registry.register('NextAuthSession', nextAuthSessionSchema);
// registry.register('NextAuthSignInRequest', nextAuthSignInRequestSchema);
registry.register('RefreshTokenRequest', refreshTokenRequestSchema);
registry.register('RefreshTokenResponse', refreshTokenResponseSchema);
registry.register('RegisterRequest', registerFormSchema);
registry.register('ProfileRequest', profileFormSchema);
registry.register('ResetPasswordRequest', resetPasswordFormSchema);

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  summary: 'User Login',
  description: 'Authenticate user with email and password',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': { schema: loginRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful, tokens returned',
      content: {
        'application/json': {
          schema: loginResponseSchema,
        },
      },
    },
    400: { description: 'Invalid credentials or request format' },
    403: { description: 'User not verified/activated' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/refresh',
  summary: 'Refresh JWT Access Token',
  description: 'Refresh access token using refresh token',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': {
          schema: refreshTokenRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'New access token generated successfully',
      content: {
        'application/json': {
          schema: refreshTokenResponseSchema,
        },
      },
    },
    400: { description: 'Missing or invalid refresh token' },
    401: { description: 'Unauthorized or expired token' },
  },
});

// Register (Sign Up)
registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  summary: 'User Registration',
  description: 'Register a user account',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': { schema: registerFormSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              message: { type: 'string' },
              userId: { type: 'number' },
            },
          },
        },
      },
    },
    400: { description: 'Validation error' },
  },
});

// Profile
registry.registerPath({
  method: 'post',
  path: '/api/auth/profile',
  summary: 'Update Profile',
  description: 'Create or update user business profile',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': { schema: profileFormSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile saved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    400: { description: 'Validation error' },
  },
});

// Reset Password
registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  summary: 'Reset Password',
  description: 'Reset user password with confirmation',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': { schema: resetPasswordFormSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    400: { description: 'Invalid or mismatched passwords' },
  },
});
