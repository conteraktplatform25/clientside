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
