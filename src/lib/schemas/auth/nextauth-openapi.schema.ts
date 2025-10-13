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
