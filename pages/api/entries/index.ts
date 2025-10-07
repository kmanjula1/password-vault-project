import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Entry, { IEntry } from '@/models/Entry';
import { Document } from 'mongoose';

type EntryDoc = Document & IEntry;

type Data = {
  success: boolean;
  entries: EntryDoc[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();

  if (req.method === 'GET') {
    const entries: EntryDoc[] = await Entry.find();
    return res.status(200).json({ success: true, entries });
  }

  res.status(405).json({ success: false, entries: [] });
}
