import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './api.ts';
import { handleSitemapXml, handleRobotsTxt } from './seoHandlers.ts';

export const app = express();

// Ensure public/uploads directory exists and serve statically
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not ensure public/uploads directory:', e);
}
app.use('/uploads', express.static(uploadsDir));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root SEO crawler endpoints
app.get('/sitemap.xml', handleSitemapXml);
app.get('/robots.txt', handleRobotsTxt);

// Mount the API Router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'qaswa-telecom-api', timestamp: new Date() });
});
