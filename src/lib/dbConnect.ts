import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing in env');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB connected');
  } catch (error: any) {
    console.error('❌ MongoDB error:', error.message);
    throw new Error('MongoDB failed');
  }
};

export default connectDB;
