/**
 * Single source for backend URL in the frontend.
 * Override with REACT_APP_BACKEND_URL in frontend/.env
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
const API_BASE = '/api';

module.exports = { BACKEND_URL, API_BASE };
