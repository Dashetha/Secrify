import { Router } from 'express';
import { SecretController } from '../controllers/secretController.js';
import { validateSecretCreation } from '../middleware/validation.js';
import { rateLimitCreate } from '../middleware/rateLimit.js';

const router = Router();

// Create a new secret with rate limiting and validation
router.post('/create', rateLimitCreate, validateSecretCreation, SecretController.createSecret);

// View a secret (requires POST for security)
router.post('/view/:id', SecretController.getSecret);

// Validate if a secret exists
router.get('/validate/:id', SecretController.validateSecret);

// Get statistics
router.get('/stats', SecretController.getSecretStats);

// Delete a secret (admin functionality)
router.delete('/:id', SecretController.deleteSecret);

export default router;