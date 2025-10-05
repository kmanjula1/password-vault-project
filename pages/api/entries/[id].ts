import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Entry from "@/models/Entry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query;

  try {
    if (req.method === "DELETE") {
      if (!id) {
        return res.status(400).json({ error: "Missing entry ID" });
      }

      const deleted = await Entry.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Entry not found" });
      }

      return res.status(200).json({ message: "Entry deleted successfully" });
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error deleting entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
