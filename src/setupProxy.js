/* eslint-disable @typescript-eslint/no-var-requires */

// reference: https://nextjs.org/docs/advanced-features/custom-server
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
};
