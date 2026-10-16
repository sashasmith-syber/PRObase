
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div style={{color:'red',padding:'2rem'}}>Something went wrong. Check the console for details.</div>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
