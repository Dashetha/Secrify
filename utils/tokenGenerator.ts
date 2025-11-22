import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export class TokenGenerator {
  private static readonly jwtSecret = process.env.JWT_SECRET!;

  static generateUniqueId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  static generateAccessToken(secretId: string): string {
    return jwt.sign({ secretId }, this.jwtSecret, { expiresIn: '24h' });
  }

  static validateAccessToken(token: string): { secretId: string } | null {
    try {
      return jwt.verify(token, this.jwtSecret) as { secretId: string };
    } catch {
      return null;
    }
  }
}