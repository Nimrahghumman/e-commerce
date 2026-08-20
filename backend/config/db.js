import mongoose from 'mongoose';
import dns from 'dns';

// Fix for querySrv ECONNREFUSED error on Windows / local ISP DNS resolvers
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connects to MongoDB Atlas database using connection string from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
