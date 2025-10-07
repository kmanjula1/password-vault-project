import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

type Data = {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password }: { email: string; password: string } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = await User.create({ email, password });

    return res.status(201).json({ 
      success: true, 
      user: { id: newUser._id.toString(), email: newUser.email } 
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
