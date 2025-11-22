// db.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/one-time-secret';
const MAX_RETRIES = 3;
const BASE_RETRY_INTERVAL_MS = 5000;

type ConnectOptions = mongoose.ConnectOptions;

export const connectDatabase = async (retryCount = 0): Promise<void> => {
  try {
    console.log(`📡 Attempting to connect to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);

    const options: ConnectOptions = {
      // Mongoose v6 defaults these, but presence is harmless for clarity.
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
      // retryWrites/retryReads are Mongo client options — keep if desired
      retryWrites: true,
      retryReads: true,
      // legacy flags are defaults in modern mongoose; still typed here for clarity
      useNewUrlParser: true as unknown as undefined,
      useUnifiedTopology: true as unknown as undefined
    } as ConnectOptions;

    // connect returns a Mongoose instance; grabbing returned connection ensures .db exists
    const conn = await mongoose.connect(MONGODB_URI, options);

    // Use the connection returned by mongoose.connect which should have .db available
    if (!conn.connection?.db) {
      throw new Error('MongoDB connection established but db handle is not available.');
    }

    // Ping the DB to ensure it responds
    await conn.connection.db.admin().ping();

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Attach listeners (do this once)
    mongoose.connection.on('error', (err: any) => {
      console.error('❌ MongoDB connection error:', {
        message: err?.message ?? String(err),
        code: err?.code ?? 'N/A',
        time: new Date().toISOString()
      });
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔁 MongoDB reconnected');
    });

  } catch (err) {
    const error = err as any;
    console.error('❌ Connection failed:', {
      message: error?.message ?? String(error),
      code: error?.code ?? 'N/A',
      time: new Date().toISOString()
    });

    if (retryCount < MAX_RETRIES - 1) {
      const wait = BASE_RETRY_INTERVAL_MS * Math.pow(2, retryCount); // exponential backoff
      console.log(`🔄 Retrying in ${wait / 1000} seconds... (retry ${retryCount + 1})`);
      await new Promise((res) => setTimeout(res, wait));
      return connectDatabase(retryCount + 1);
    } else {
      console.error('❌ Max retry attempts reached.');
      // Option A: throw so the app's top-level code can decide (recommended)
      throw new Error('Unable to connect to MongoDB after maximum retries.');
      // Option B (if you want to exit immediately): uncomment the line below
      // process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('ℹ️ MongoDB already disconnected.');
      return;
    }
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (err) {
    const error = err as any;
    console.error('❌ Error disconnecting from MongoDB:', {
      message: error?.message ?? String(error),
      time: new Date().toISOString()
    });
  }
};

export const databaseStatus = {
  isConnected: (): boolean => mongoose.connection.readyState === 1,
  // return clear string names
  getState: (): string => {
    switch (mongoose.connection.readyState) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection?.db) {
      console.warn('⚠️ No DB handle available to test connection.');
      return false;
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (err) {
    console.error('Connection test failed:', (err as any)?.message ?? String(err));
    return false;
  }
};

/**
 * Optional: call this from your app entry point to gracefully stop on signals
 * Example:
 *   import { disconnectDatabase } from './db';
 *   process.on('SIGINT', async () => { await disconnectDatabase(); process.exit(0); });
 */
export const setupGracefulShutdown = (): void => {
  const shutdown = async () => {
    console.log('🛑 Graceful shutdown initiated');
    try {
      await disconnectDatabase();
    } catch (e) {
      console.error('Error during graceful shutdown:', (e as any)?.message ?? String(e));
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};



