// app/api/login/route.ts (App Router)

import { dbConnect } from '@/lib/db';
import User, { IUser } from '@/models/User';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// The function must be named after the HTTP method (POST in this case)
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // App Router reads the body differently
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    // Explicitly type user
    const user: IUser | null = await User.findOne({ email }).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (_err) {
    // This catches the 'err' unused warning you already fixed
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// NOTE: You must also ensure your app/api/register/route.ts file is converted to use 'export async function POST(req: NextRequest)' as well!