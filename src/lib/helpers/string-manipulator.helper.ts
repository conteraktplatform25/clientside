import { CurrencyType } from '@prisma/client';

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

/**
 * Returns the initials from a first name and last name.
 * Example: getInitials("John", "Doe") -> "JD"
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName?.trim().charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.trim().charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

export const parsePhoneNumber = (input: string) => {
  // Use regex to match optional country code and the phone number
  const regex = /^\(?(\+\d+)\)?(\d+)$/;

  const match = input.trim().match(regex);

  if (match) {
    return {
      countryCode: match[1],
      phoneNumber: match[2],
    };
  } else {
    // No country code, just phone number
    return {
      countryCode: null,
      phoneNumber: input,
    };
  }
};

export const getCurrencySymbol = (currency: CurrencyType): string => {
  const map: Record<CurrencyType, string> = {
    NAIRA: '₦',
    DOLLAR: '$',
    POUND: '£',
    EURO: '€',
    CNY: '¥',
  };
  return map[currency] ?? '₦';
};
