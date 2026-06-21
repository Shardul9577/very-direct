const { createProxyMiddleware } = require('http-proxy-middleware');
const { BACKEND_URL } = require('./config/backend');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
    })
  );
};
