import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import { app } from './src/server/app.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    // Mount Vite middleware for dev HMR, module resolution and SPA serving
    app.use(vite.middlewares);
  } else {
    // In production, serve the built Vite SPA from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // Fallback all non-API GET requests to index.html for client-side routing
    app.get('*', (req, res, next) => {
      if (
        req.path.startsWith('/api') ||
        req.path === '/sitemap.xml' ||
        req.path === '/robots.txt'
      ) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QASWA TELECOM full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

