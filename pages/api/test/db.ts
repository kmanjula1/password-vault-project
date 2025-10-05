import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "✅ MongoDB connected successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: "❌ MongoDB connection failed", error: error.message });
  }
}