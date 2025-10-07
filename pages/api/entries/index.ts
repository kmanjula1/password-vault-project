import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const entries = await Entry.find();
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const newEntry = new Entry(req.body);
      await newEntry.save();
      return res.status(201).json(newEntry);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
