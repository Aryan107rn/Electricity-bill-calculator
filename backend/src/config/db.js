import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️  MongoDB unavailable: ${err.message}`);
    console.warn(`⚠️  Running WITHOUT database — history/stats won't work until MongoDB is connected.`);
    // Do NOT exit — keep the server alive for routes that don't need DB
  }
};

export default connectDB;
