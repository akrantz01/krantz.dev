const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getOrdinal = (day: number): string => {
  if (day === 11 || day === 12 || day === 13) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

/**
 * Convert a date into a string
 * @param date the date to format
 */
export const formatDate = (date: Date): string => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const ordinal = getOrdinal(day);
  const year = date.getFullYear();

  return `${month} ${day}${ordinal}, ${year}`;
};
