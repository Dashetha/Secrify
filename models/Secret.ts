import mongoose, { Document, Schema } from 'mongoose';

export interface ISecret extends Document {
  uniqueId: string;
  encryptedMessage: string;
  iv: string;
  authTag: string;
  hashedPassword?: string;
  viewCount: number;
  maxViews: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  accessedAt?: Date;
}

const SecretSchema: Schema = new Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  encryptedMessage: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  authTag: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxViews: {
    type: Number,
    default: 1,
    min: 1
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accessedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
SecretSchema.index({ uniqueId: 1, isActive: 1 });
SecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISecret>('Secret', SecretSchema);