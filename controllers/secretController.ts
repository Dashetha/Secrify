import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Secret, { ISecret } from '../models/Secret.js'; // Corrected import
import { EncryptionService } from '../utils/encryption.js';
import { TokenGenerator } from '../utils/tokenGenerator.js';

export class SecretController {
  static async createSecret(req: Request, res: Response) {
    try {
      const { message, password, expiresIn = '24', maxViews = 1 } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (message.length > 10000) {
        return res.status(400).json({ error: 'Message too long' });
      }

      // Generate unique ID
      const uniqueId = TokenGenerator.generateUniqueId();

      // Encrypt the message
      const { encrypted, iv, authTag } = EncryptionService.encrypt(message.trim());

      // Calculate expiration date
      const expiresAt = new Date();
      const hours = parseInt(expiresIn) || 24;
      expiresAt.setHours(expiresAt.getHours() + hours);

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (password && password.trim().length > 0) {
        hashedPassword = await bcrypt.hash(password, 12);
      }

      // Create secret document
      const secret = new Secret({
        uniqueId,
        encryptedMessage: encrypted,
        iv,
        authTag,
        hashedPassword,
        maxViews: parseInt(maxViews) || 1,
        expiresAt,
        isActive: true
      });

      await secret.save();

      // Generate access token
      const accessToken = TokenGenerator.generateAccessToken(uniqueId);

      res.status(201).json({
        success: true,
        secretId: uniqueId,
        accessToken,
        expiresAt: secret.expiresAt,
        url: `${req.protocol}://${req.get('host')}/view/${uniqueId}`,
        message: 'Secret created successfully'
      });

    } catch (error) {
      console.error('Create secret error:', error);
      res.status(500).json({ error: 'Failed to create secret' });
    }
  }

  static async getSecret(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password, token } = req.body;

      if (!id || id.length !== 32) {
        return res.status(400).json({ error: 'Invalid secret ID' });
      }

      // Find active secret
      const secret = await Secret.findOne({ 
        uniqueId: id, 
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!secret) {
        return res.status(404).json({ error: 'Secret not found, expired, or already viewed' });
      }

      // Validate access token
      const tokenData = TokenGenerator.validateAccessToken(token);
      if (!tokenData || tokenData.secretId !== id) {
        return res.status(401).json({ error: 'Invalid access token' });
      }

      // Check password if required
      if (secret.hashedPassword) {
        if (!password) {
          return res.status(401).json({ error: 'Password required' });
        }
        const isValidPassword = await bcrypt.compare(password, secret.hashedPassword);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid password' });
        }
      }

      // Check view count
      if (secret.viewCount >= secret.maxViews) {
        await Secret.findByIdAndUpdate(secret._id, { isActive: false });
        return res.status(410).json({ error: 'Secret has already been viewed' });
      }

      // Decrypt message
      const decryptedMessage = EncryptionService.decrypt(
        secret.encryptedMessage, 
        secret.iv, 
        secret.authTag
      );

      // Update view count and check if should deactivate
      secret.viewCount += 1;
      secret.accessedAt = new Date();
      
      if (secret.viewCount >= secret.maxViews) {
        secret.isActive = false;
      }
      
      await secret.save();

      res.json({
        success: true,
        message: decryptedMessage,
        viewsRemaining: Math.max(0, secret.maxViews - secret.viewCount),
        isActive: secret.isActive,
        viewedAt: new Date()
      });

    } catch (error: any) {
      console.error('Get secret error:', error);
      
      if (error.message === 'Failed to decrypt message') {
        return res.status(500).json({ error: 'Failed to decrypt secret' });
      }
      
      res.status(500).json({ error: 'Failed to retrieve secret' });
    }
  }

  static async validateSecret(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || id.length !== 32) {
        return res.status(400).json({ 
          exists: false, 
          error: 'Invalid secret ID' 
        });
      }

      const secret = await Secret.findOne({ 
        uniqueId: id, 
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!secret) {
        return res.status(404).json({ 
          exists: false, 
          error: 'Secret not found or expired' 
        });
      }

      res.json({
        exists: true,
        requiresPassword: !!secret.hashedPassword,
        viewsRemaining: Math.max(0, secret.maxViews - secret.viewCount),
        expiresAt: secret.expiresAt,
        maxViews: secret.maxViews,
        viewCount: secret.viewCount
      });

    } catch (error) {
      console.error('Validate secret error:', error);
      res.status(500).json({ error: 'Failed to validate secret' });
    }
  }

  static async getSecretStats(req: Request, res: Response) {
    try {
      const totalSecrets = await Secret.countDocuments();
      const activeSecrets = await Secret.countDocuments({ 
        isActive: true, 
        expiresAt: { $gt: new Date() } 
      });
      const viewedSecrets = await Secret.countDocuments({ viewCount: { $gt: 0 } });

      res.json({
        totalSecrets,
        activeSecrets,
        viewedSecrets,
        expiredSecrets: totalSecrets - activeSecrets
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }

  static async deleteSecret(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || id.length !== 32) {
        return res.status(400).json({ error: 'Invalid secret ID' });
      }

      const result = await Secret.findOneAndDelete({ uniqueId: id });

      if (!result) {
        return res.status(404).json({ error: 'Secret not found' });
      }

      res.json({
        success: true,
        message: 'Secret deleted successfully',
        deletedAt: new Date()
      });

    } catch (error) {
      console.error('Delete secret error:', error);
      res.status(500).json({ error: 'Failed to delete secret' });
    }
  }
}