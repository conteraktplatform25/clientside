import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// 🧠 Matches your NextAuth Session type
export const nextAuthSessionSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.email(),
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
      role: z.string(),
      image: z.string().nullable().optional(),
      phone_number: z.string().nullable().optional(),
      registered_number: z.string().nullable().optional(),
    })
    .nullable(),
  validity: z.union([
    z.object({
      valid_until: z.number().optional(),
      refresh_until: z.number().optional(),
    }),
    z.record(z.string(), z.any()),
  ]),
  error: z.enum(['RefreshTokenExpired', 'RefreshAccessTokenError']).optional(),
});

// 🧠 Sign-in request payload for CredentialsProvider
export const nextAuthSignInRequestSchema = z.object({
  email: z.email().optional(),
  password: z.string().optional(),
  provider: z.string().optional(),
});

export const loginRequestSchema = z.object({
  email: z.email().describe('User email address'),
  password: z.string().describe('User password'),
});

export const loginResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  token: z
    .object({
      access: z.string().describe('JWT access token'),
      refresh: z.string().describe('JWT refresh token'),
    })
    .optional(),
  payload: z
    .object({
      id: z.string(),
      email: z.string(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      role: z.string().nullable(),
      image: z.string().nullable().optional(),
      phone_number: z.string().nullable(),
      registered_number: z.string().nullable(),
    })
    .optional(),
});

// 🧠 JWT Refresh Request
export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string().describe('Refresh token used to generate new access token'),
});

// 🧠 JWT Refresh Response
export const refreshTokenResponseSchema = z.object({
  ok: z.boolean(),
  data: z.string().optional(),
  message: z.string(),
  error: z.string().optional(),
});

export const registerRequestSchema = z.object({
  email: z.email().describe('User email address'),
  first_name: z.string().describe('User first name'),
  last_name: z.string().describe('User last name'),
});

export const registerResponseSchema = z.object({
  ok: z.boolean(),
  profile: z
    .object({
      id: z.string().optional(),
      email: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      is_activated: z.boolean().optional(),
    })
    .optional(),
  message: z.string(),
  error: z.string().optional(),
});

export const verifyTokenRequestSchema = z.object({
  email: z.email().describe('User email used during registration'),
  otp: z.string().describe('6-digit one-time verification code'),
});

export const VerifyTokenResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// ✅ Define request and response schemas
export const CreateProfileRequestSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone_country_code: z.string().min(1, 'Country code is required'),
  phone_number: z.string().min(6, 'Phone number is required'),
  company_name: z.string().optional(),
  company_website: z.string().url().optional(),
  company_location: z.string().optional(),
  business_industry: z.string().optional(),
  business_category: z.string().optional(),
  annual_revenue: z.string().optional(),
});

export const CreateProfileResponseSchema = z.object({
  ok: z.boolean(),
  profile: z
    .object({
      id: z.number(),
      userId: z.number(),
      company_name: z.string().nullable(),
      phone_number: z.string(),
      company_location: z.string().nullable(),
      company_website: z.string().nullable(),
      business_industry: z.string().nullable(),
      business_category: z.string().nullable(),
      annual_revenue: z.string().nullable(),
    })
    .optional(),
  message: z.string(),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.email().describe('User email address'),
});
export const ForgotPasswordResponseSchema = z.object({
  ok: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'If an account exists, an email will be sent.' }),
});

// 🧩 Request schema
export const ResetPasswordRequestSchema = z.object({
  email: z.email().openapi({ example: 'user@example.com' }),
  password: z
    .string()
    .min(8)
    .openapi({ example: 'newSecurePassword123', description: 'New password (min 8 characters)' }),
  otp: z.string().min(4).max(6).openapi({
    example: '483920',
    description: 'The one-time password (OTP) sent to the user’s email.',
  }),
});

// 🧩 Success response schema
export const ResetPasswordResponseSchema = z.object({
  ok: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'Password reset successful' }),
});

// 🧱 Request Schema
export const VerifyOtpRequestSchema = z.object({
  email: z.email().openapi({
    example: 'user@example.com',
    description: 'The email address associated with the OTP code.',
  }),
  otp: z.string().min(4).max(6).openapi({
    example: '834290',
    description: 'The one-time password (OTP) sent to the user’s email.',
  }),
  flow: z.enum(['signup', 'reset']).optional().openapi({
    example: 'signup',
    description: 'The process where this OTP is being used, e.g., "signup" or "reset".',
  }),
});

// 🧱 Success Response Schema
export const VerifyOtpResponseSchema = z.object({
  ok: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'One time Password verified successfully.' }),
  flow: z
    .string()
    .optional()
    .openapi({ example: 'signup', description: 'Indicates which verification flow was used.' }),
});

// 🧱 Error Response Schema
export const VerifyOtpErrorSchema = z.object({
  ok: z.boolean().optional().openapi({ example: false }),
  message: z.string().optional().openapi({ example: 'Invalid or expired OTP' }),
});
