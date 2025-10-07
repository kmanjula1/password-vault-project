import { NextResponse } from 'next/server';
import * as argon2 from 'argon2'; 
import User from '@/models/User'; 
import connectDB from '@/lib/db'; 

export async function POST(request: Request) {
    await connectDB();
    
    try {
        const body = await request.json();
        const { email, password } = body; // Plaintext password from the user

        // 1. Find the user in the database
        const user = await User.findOne({ email });

        if (!user) {
            // Use generic error messages for security (no "user not found")
            return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
        }
        
        // 2. VERIFY the password against the stored hash
        const isValid = await argon2.verify(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
        }

        // 3. SUCCESS: The passwords match!
        
        // (*** JWT/Session creation logic would go here ***)
        
        return NextResponse.json({ 
            message: "Login successful.", 
            userId: user._id
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Login failed." }, { status: 500 });
    }
}