import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

import Entry, { IEntry } from '../../../models/Entry';

export default async function handler(
  req: NextApiRequest & { body: IEntry },
  res: NextApiResponse
) {
  await connectToDatabase();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const entries = await Entry.find({});
        res.status(200).json({ success: true, data: entries });
      } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        const entry = await Entry.create(req.body);
        res.status(201).json({ success: true, data: entry });
      } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('ValidationError')) {
          res.status(400).json({ success: false, error: errorMessage });
        } else {
          res.status(500).json({ success: false, error: 'Failed to create entry' });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
