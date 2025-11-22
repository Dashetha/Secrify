import express from 'express';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import { serverConfig, getServerStartupMessage } from './config/server.js';
import { 
  corsOptions, 
  securityHeaders, 
  xssProtection, 
  noCache 
} from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { rateLimitAPI } from './middleware/rateLimit.js';
import routes from './routes/index.js';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(xssProtection);

// Body parsing middleware
app.use(express.json({ limit: serverConfig.security.maxRequestSize }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimitAPI);

// API routes
app.use(serverConfig.api.prefix, routes);

// No cache for all routes
app.use(noCache);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: serverConfig.environment,
    version: serverConfig.api.version,
  });
});

// 404 handler
app.use(notFound);

// Error handler (should be last)
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start Express server
    app.listen(serverConfig.port, () => {
      console.log(getServerStartupMessage());
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔻 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔻 Server terminated');
  process.exit(0);
});

// Start the application
startServer();

export default app;