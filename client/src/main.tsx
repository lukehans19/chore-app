import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App.tsx';

const theme = createTheme({
  palette: {
    primary: { main: '#4A90D9' },
    secondary: { main: '#95a5a6' },
    error: { main: '#e74c3c' },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
