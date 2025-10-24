import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
//import { resetPasswordFormSchema } from './schemas/auth/resetpassword.schema';
import { z } from 'zod';
import {
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
  verifyTokenRequestSchema,
  VerifyTokenResponseSchema,
  ResetPasswordRequestSchema,
  ResetPasswordResponseSchema,
  VerifyOtpRequestSchema,
  VerifyOtpResponseSchema,
  VerifyOtpErrorSchema,
} from './schemas/auth/nextauth-openapi.schema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import {
  CreateCategorySchema,
  CategoryResponseSchema,
  UpdateCategorySchema,
} from '@/lib/schemas/business/server/catalogue.schema';

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

registry.register('CreateProfileRequest', CreateProfileRequestSchema);
registry.register('CreateProfileResponse', CreateProfileResponseSchema);

registry.register('RefreshTokenRequest', refreshTokenRequestSchema);
registry.register('RefreshTokenResponse', refreshTokenResponseSchema);

registry.register('RegisterRequest', registerRequestSchema);
registry.register('RegisterResponse', registerResponseSchema);

registry.register('VerifyTokenRequest', verifyTokenRequestSchema);
registry.register('VerifyTokenResponse', VerifyTokenResponseSchema);

//registry.register('ProfileRequest', profileFormSchema);
registry.register('ResetPasswordRequest', ResetPasswordRequestSchema);
registry.register('ResetPasswordResponse', ResetPasswordResponseSchema);

registry.register('VerifyOtpRequest', VerifyOtpRequestSchema);
registry.register('VerifyOtpResponse', VerifyOtpResponseSchema);

//Login Implementation
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

// Token refresh Implementation
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
  summary: 'Register a new user',
  description:
    'Creates a new user account and sends an email verification code using Resend. The user remains inactive until OTP Code has been verified.',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User successfully registered and verification email sent',
      content: {
        'application/json': {
          schema: registerResponseSchema,
        },
      },
    },
    400: { description: 'Missing or invalid fields' },
    409: { description: 'Email already exists' },
    500: { description: 'Internal server error' },
  },
});

// OTP code verification Implementation
registry.registerPath({
  method: 'post',
  path: '/api/auth/verify-otp',
  summary: 'Verify email OTP code',
  description:
    'Verifies a one-time password (OTP) sent to the user email during registration. If valid, the user account is activated.',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyTokenRequestSchema,
          example: {
            email: 'user@example.com',
            otp: '123456',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Email verified successfully',
      content: {
        'application/json': {
          schema: VerifyTokenResponseSchema,
        },
      },
    },
    400: { description: 'Invalid or expired OTP, or missing fields' },
    500: { description: 'Internal server error' },
  },
});

// Profile
registry.registerPath({
  method: 'post',
  path: '/api/auth/profile',
  description: 'Create or update user business profile.',
  summary: 'Create Business Profile',
  tags: ['Authentication'],
  request: {
    query: z.object({
      email: z.email(),
    }),
    body: {
      content: {
        'application/json': {
          schema: CreateProfileRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successfully created or updated profile',
      content: {
        'application/json': {
          schema: CreateProfileResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing or invalid fields',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// Forgot Password
registry.registerPath({
  method: 'post',
  path: '/api/auth/forgot-password',
  tags: ['Authentication'],
  summary: 'Request password reset link',
  description:
    'Sends a password reset email with a verification token if the user exists. Always responds successfully to prevent user enumeration.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ForgotPasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset email triggered successfully (even if user not found).',
      content: {
        'application/json': {
          schema: ForgotPasswordResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request or unexpected error',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().optional(),
            message: z.string().optional(),
          }),
        },
      },
    },
  },
});

// Reset Password
registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  summary: 'Reset user password with OTP verification',
  description:
    'Verifies a one-time password (OTP) sent to the user’s email and resets their password if the OTP is valid.',
  tags: ['Authentication'], // ✅ Tag assigned here
  request: {
    body: {
      content: {
        'application/json': { schema: ResetPasswordRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Password successfully reset.',
      content: {
        'application/json': {
          schema: ResetPasswordResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing fields, invalid OTP, or expired token.',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().optional(),
            message: z.string().optional(),
          }),
        },
      },
    },
    409: {
      description: 'Email does not exist.',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().optional(),
            message: z.string().optional(),
          }),
        },
      },
    },
  },
});

//Verify OTP
registry.registerPath({
  method: 'post',
  path: '/api/auth/verify-otp',
  summary: 'Verify a one-time password (OTP) for email verification or password reset',
  description:
    'Validates a one-time password (OTP) sent to a user’s email. If valid, the OTP is marked as used. For signup flows, the user account is activated.',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': { schema: VerifyOtpRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'OTP successfully verified and user activated (if applicable).',
      content: {
        'application/json': {
          schema: VerifyOtpResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing fields, invalid, or expired OTP.',
      content: {
        'application/json': {
          schema: VerifyOtpErrorSchema,
        },
      },
    },
  },
});

//Catalogue Module Registry
registry.registerPath({
  method: 'get',
  path: '/api/catalogue/categories',
  tags: ['Product Categories'],
  summary: 'Get all categories for the authenticated business',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'List of categories retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            categories: z.array(CategoryResponseSchema),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    404: { description: 'Business profile not found' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/catalogue/categories',
  tags: ['Product Categories'],
  summary: 'Create a new category under the authenticated business profile',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCategorySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Category created successfully',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            category: CategoryResponseSchema,
          }),
        },
      },
    },
    400: { description: 'Invalid input or missing data' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: Insufficient permissions' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/catalogue/categories/{id}',
  tags: ['Product Categories'],
  summary: 'Retrieve a single category by ID (including subcategories)',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.uuid().openapi({
        example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654',
        description: 'The UUID of the category to retrieve',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Successful retrieval of a category and its subcategories',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Successful retrieval' }),
            profile: CategoryResponseSchema, // note: your success() function wraps payload under "profile"
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    404: { description: 'Category not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/catalogue/categories/{id}',
  tags: ['Product Categories'],
  summary: 'Update a category by ID',
  description:
    'Allows authorized users (Business/Admin) to modify the name, description, or parent category of an existing category.',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateCategorySchema.openapi('UpdateCategoryRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Category successfully updated',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Successful updated Category' }),
            profile: CategoryResponseSchema,
          }),
        },
      },
    },
    400: { description: 'Invalid input' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: Insufficient permissions' },
    404: { description: 'Category not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/catalogue/categories/{id}',
  tags: ['Product Categories'],
  summary: 'Delete a category by ID',
  description: 'Removes a category (and optionally its subcategories) from the catalogue.',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Category deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Category deleted' }),
          }),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden: Insufficient permissions' },
    404: { description: 'Category not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/catalogue/categories/count',
  tags: ['Product Categories'],
  summary: 'Get the total count of categories for the authenticated business',
  description:
    "Returns the number of categories belonging to the authenticated user's business profile. Requires `Business` role authorization.",
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Category count retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Category count retrieved successfully' }),
            profile: z.object({
              count: z.number().openapi({ example: 42 }),
            }),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized — user not authenticated',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: 'Unauthorized' }),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden — insufficient permissions',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: 'Forbidden: Insufficient permissions' }),
          }),
        },
      },
    },
    404: {
      description: 'Business profile not configured or not found',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: 'Whatsapp Profile has not been configured.' }),
          }),
        },
      },
    },
    500: {
      description: 'Unexpected server error',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: 'An unexpected error occurred' }),
          }),
        },
      },
    },
  },
});
