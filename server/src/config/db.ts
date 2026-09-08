import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable SRV record resolution for MongoDB Atlas on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback to system DNS if setting fails
}

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('⏳ Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ MongoDB Connection Error: ${errorMessage}`);
    console.error(`
👉 How to fix:
1. If using MongoDB Atlas (Cloud - Free & Recommended):
   Update MONGODB_URI in server/.env with your Atlas connection string:
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-leads?retryWrites=true&w=majority

2. If using local MongoDB:
   Ensure MongoDB service is installed and started (run 'net start MongoDB' or 'mongod').
`);
    process.exit(1);
  }
};

export default connectDB;
