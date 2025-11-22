import { config } from './env.js';

const PORT = Number(config.PORT ?? process.env.PORT ?? 5000);
const NODE_ENV = String(config.NODE_ENV ?? process.env.NODE_ENV ?? 'development');

export const serverConfig = {
  // Server configuration
  port: PORT,
  environment: NODE_ENV,
  
  // API configuration
  api: {
    prefix: '/api',
    version: '1.0.0',
    name: 'One-Time Secret API',
  },
  
  // Security configuration
  security: {
    maxRequestSize: '10mb',
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // max requests per window
  },
  
  // CORS configuration
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Database configuration
  database: {
    maxConnections: 10,
    connectionTimeout: 30000,
    acquireTimeout: 60000,
  },
};

// Export server startup message
export const getServerStartupMessage = (): string => {
  return `
🚀 One-Time Secret API Server Started!
📍 Environment: ${serverConfig.environment}
📍 Port: ${serverConfig.port}
📍 API: ${serverConfig.api.prefix}/v${serverConfig.api.version}
📍 Database: ${config.NODE_ENV === 'development' ? 'Development' : 'Production'}
⏰ Started at: ${new Date().toISOString()}
  `.trim();
};