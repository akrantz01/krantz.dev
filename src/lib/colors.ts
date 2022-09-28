import defaultTheme from 'windicss/defaultTheme';

export const colors: Record<string, Record<number, string>> = {
  ...defaultTheme.colors,
  gray: {
    50: '#f9fafb',
    100: '#eaeaeb',
    200: '#cacbcd',
    300: '#a7a9ac',
    400: '#696c71',
    500: '#282d34',
    600: '#24292f',
    700: '#181b20',
    800: '#121518',
    900: '#0c0e10',
  },
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
};
