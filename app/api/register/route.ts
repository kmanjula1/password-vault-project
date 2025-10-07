// app/api/register/route.ts (App Router Conversion)

import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();

  // 1. App Router reads the body using req.json()
  const { email, password }: { email: string; password: string } = await req.json();

  if (req.method !== 'POST') {
    // App Router handles method checks automatically, but good to keep basic validation
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }
  
  if (!email || !password) {
     return NextResponse.json(
      { success: false, message: 'Email and password required' },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const newUser = await User.create({ email, password });

    return NextResponse.json(
      { 
        success: true, 
        user: { id: newUser._id.toString(), email: newUser.email } 
      },
      { status: 201 }
    );
  } catch (_err) {
    // This is the clean catch block to resolve your last warning!
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
