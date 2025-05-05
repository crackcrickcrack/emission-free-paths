import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

// Add error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Debug logging
console.log('Application starting...');

try {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to render application:', error);
  
  // Show error in the DOM if rendering fails
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f3f4f6;
        padding: 1rem;
      ">
        <div style="
          max-width: 32rem;
          width: 100%;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        ">
          <h1 style="
            font-size: 1.5rem;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 1rem;
          ">
            Application Error
          </h1>
          <p style="
            color: #4b5563;
            margin-bottom: 1rem;
          ">
            ${error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button
            onclick="window.location.reload()"
            style="
              width: 100%;
              background-color: #059669;
              color: white;
              font-weight: 500;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
