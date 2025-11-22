import { Router } from 'express';
import secretRoutes from './secrets.js';

const router = Router();

// API routes
router.use('/secrets', secretRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'One-Time Secret API',
    version: '1.0.0',
    endpoints: {
      createSecret: 'POST /api/secrets/create',
      viewSecret: 'POST /api/secrets/view/:id',
      validateSecret: 'GET /api/secrets/validate/:id',
      stats: 'GET /api/secrets/stats',
      deleteSecret: 'DELETE /api/secrets/:id'
    },
    documentation: 'Add your API documentation link here'
  });
});

export default router;