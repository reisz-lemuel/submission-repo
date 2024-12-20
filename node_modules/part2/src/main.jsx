import React from 'react'; // Add this if using React < 18 and need backward compatibility
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Ensure proper syntax for render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
