// pages/api/entries/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Entry from "@/models/Entry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    if (req.method === "GET") {
      const entries = await Entry.find();
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const { title, username, password } = req.body;

      if (!title || !username || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // For now, using a dummy userId; later replace with actual authenticated user
      const entry = new Entry({ userId: "dummyUserId", title, username, password });
      await entry.save();

      return res.status(201).json({ message: "Entry saved successfully!" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
