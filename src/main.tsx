import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
