import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely catch cross-origin security errors triggered when third-party scripts (like Disqus)
// attempt to inspect parent/top window documents in sandboxed preview iframes.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('Permission denied') ||
      event.message?.includes('cross-origin') ||
      event.message?.includes('SecurityError') ||
      (event.filename && event.filename.includes('disqus'))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = String(event.reason?.message || event.reason || '');
    if (
      reason.includes('Permission denied') ||
      reason.includes('cross-origin') ||
      reason.includes('SecurityError')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

