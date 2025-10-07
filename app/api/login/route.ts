import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import User, { IUser } from '@/models/User';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type Data = {
  success: boolean;
  token?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Explicitly type user
    const user: IUser | null = await User.findOne({ email }).lean<IUser>();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.status(200).json({ success: true, token });
  } catch (_err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
