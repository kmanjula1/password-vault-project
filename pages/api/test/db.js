// pages/api/test/db.js
import mongoose from 'mongoose';

const handler = async (req, res) => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    res.status(200).json({ message: "✅ MongoDB connected successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ MongoDB connection failed", error: error.message });
  }
};

export default handler;