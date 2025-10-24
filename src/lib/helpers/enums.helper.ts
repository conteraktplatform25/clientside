import { CurrencyType } from '@prisma/client';

export const currencyOptions = Object.values(CurrencyType).map((currency) => ({
  label: currency.charAt(0) + currency.slice(1).toLowerCase(), // e.g. "Naira"
  value: currency, // e.g. "NAIRA"
}));
