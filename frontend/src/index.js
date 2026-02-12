import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Lazy load App component
const App = React.lazy(() => import('./App'));

const LoadingFallback = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF'
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', color: '#D32F2F', marginBottom: '1rem' }}>
        AI SOLVED BUSINESS PROBLEMS
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading...</p>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
