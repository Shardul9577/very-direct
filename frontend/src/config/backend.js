/**
 * Single source for backend URL in the frontend.
 * Override with REACT_APP_BACKEND_URL in frontend/.env (required on Vercel).
 */
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001').replace(
  /\/$/,
  ''
);

// Dev: relative /api is proxied by setupProxy.js to BACKEND_URL.
// Production: call the deployed backend directly (Vercel only hosts the React app).
const API_BASE = process.env.REACT_APP_BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

module.exports = { BACKEND_URL, API_BASE };
