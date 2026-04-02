import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { errorMiddleware } from './mw/error.middleware';
import { authRoutes } from './modules/auth/auth.route';

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  // Plugins
  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100, // 100 requests per window
    timeWindow: '1 minute'
  });

  await app.register(cors, {
    origin: '*', // TODO: restrict in production based on tenant domain
    credentials: true,
  });
  
  await app.register(cookie);
  
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    cookie: {
      cookieName: 'refreshToken',
      signed: false, // Ensure false if not using signed cookies
    }
  });

  // Global Error Handler
  app.setErrorHandler(errorMiddleware);

  // Health check route
  app.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register domain modules
  app.register(async (api) => {
    // Prefix all api routes with /api/v1
    api.register(authRoutes, { prefix: '/auth' });
  }, { prefix: '/api/v1' });

  return app;
}
