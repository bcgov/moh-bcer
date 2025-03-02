import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'BCSans', 'Raleway', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'
    ].join(','),
    h5: {
      color: '#002C71',
      fontSize: '27px',
      fontWeight: 600,
      padding: '1.5rem 0'
    },
    h6: {
      fontSize: '20px',
      fontWeight: 600
    },
    subtitle1: {
      fontSize: '17px',
      fontWeight: 600
    },
    subtitle2: {
      fontSize: '14px',
      color: '#333333',
      fontWeight: 600
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px'
    },
  },
  palette: {
  }
});

