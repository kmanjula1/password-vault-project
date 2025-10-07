import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const entry = await Entry.findById(id);
      if (!entry) return res.status(404).json({ error: "Entry not found" });
      return res.status(200).json(entry);
    }

    if (req.method === "PUT") {
      const updated = await Entry.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await Entry.findByIdAndDelete(id);
      return res.status(200).json({ message: "Entry deleted" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
