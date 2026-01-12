export const emailTheme = {
  colors: {
    primary: '#1a73e8',
    primary50: '#ddeafb',
    primary200: '#b3d0f7',
    primary800: '#0d3a74',

    neutral900: '#1a1c20',
    neutral700: '#35393f',
    neutral500: '#6c717a',
    neutralBase: '#4f555f',
    neutral50: '#e7e7e8',

    background: '#f8fafc',
    white: '#ffffff',
    black: '#121212',
    border: '#e6eef9',
  },

  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',

    h1: {
      fontSize: '20px',
      fontWeight: '700',
    },

    body: {
      fontSize: '15px',
      lineHeight: '1.5',
    },

    small: {
      fontSize: '13px',
      lineHeight: '1.5',
    },
  },

  spacing: {
    containerPadding: '28px 32px 18px 32px',
    footerPadding: '18px 24px',
  },

  layout: {
    maxWidth: '600px',
    borderRadius: '0px', // keep flat for email safety
  },
};
