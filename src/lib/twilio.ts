import twilio from 'twilio';

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
if (!TWILIO_AUTH_TOKEN) throw new Error('Missing TWILIO_AUTH_TOKEN');

export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Validate Twilio signature using raw body and request url.
 * - rawBody string should be the exact raw body Twilio posted (form-encoded).
 * - url must be the full publicly accessible URL Twilio called (including querystring).
 */
export function validateTwilioSignature({
  signature,
  url,
  rawBody,
}: {
  signature: string;
  url: string;
  rawBody: string;
}) {
  // Twilio expects the POST params as an object when using validateRequest.
  // Convert rawBody (form-encoded) into an object:
  const params = Object.fromEntries(new URLSearchParams(rawBody));

  return twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, params);
}
