import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Entry, { IEntry } from '@/models/Entry';
import { Document } from 'mongoose';

type EntryDoc = Document & IEntry;

type Data = {
  success: boolean;
  entry: EntryDoc | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    const entry: EntryDoc | null = await Entry.findById(id);
    return res.status(200).json({ success: true, entry });
  }

  if (req.method === 'DELETE') {
    const entry: EntryDoc | null = await Entry.findByIdAndDelete(id);
    return res.status(200).json({ success: true, entry });
  }

  res.status(405).json({ success: false, entry: null });
}
