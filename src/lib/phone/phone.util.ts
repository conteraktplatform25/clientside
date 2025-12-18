import { getErrorMessage } from '@/utils/errors';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export type TPhoneValidationResult = {
  isValid: boolean;
  normalized?: string; // E.164 without +
  country?: CountryCode;
  error?: string;
};

export function validateAndNormalizePhone(phone: string, defaultCountry?: CountryCode): TPhoneValidationResult {
  try {
    const parsed = parsePhoneNumberFromString(phone, defaultCountry);

    if (!parsed) {
      return { isValid: false, error: 'Invalid phone format' };
    }

    if (!parsed.isValid()) {
      return { isValid: false, error: 'Invalid phone number' };
    }

    return {
      isValid: true,
      normalized: parsed.number.replace('+', ''), // 🔥 WhatsApp format
      country: parsed.country,
    };
  } catch (err) {
    const message = getErrorMessage(err);
    console.log('Validate Phone Number', message);
    return {
      isValid: false,
      error: `Phone Number parsing failed ${message}`,
    };
  }
}
