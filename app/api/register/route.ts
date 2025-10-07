// 1. IMPORTS
// We use 'next/server' for proper Next.js API response handling
import { NextResponse } from 'next/server';
// We need the argon2 library (Must be installed: npm install argon2)
import * as argon2 from 'argon2'; 
// Assuming your User model is defined and exported in a file like 'models/User'
import User from '@/models/User'; 
import connectDB from '@/lib/db'; // Assuming a separate DB connection utility

// 2. THE ROUTE HANDLER FUNCTION
// Next.js App Router uses exported functions for HTTP methods
export async function POST(request: Request) {
    // 1. Connect to the database
    await connectDB();
    
    try {
        // We use req.json() instead of req.body for Next.js App Router
        const body = await request.json();
        const { email, password } = body;

        // --- Basic Validation ---
        if (!email || !password) {
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
        }
        
        // --- 3. The Registration Logic ---
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists." }, { status: 409 });
        }
        
        // Generate the password hash (Argon2 handles the salt internally 
        // and includes it in the final hash string)
        const passwordHash = await argon2.hash(password);

        // Create the new user document
        const newUser = await User.create({ 
            email, 
            passwordHash,
            // We would also add the client-side encryption salt/key information here later
        });

        // 4. Return success
        return NextResponse.json({ 
            message: "User registered successfully.", 
            userId: newUser._id
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Registration failed." }, { status: 500 });
    }
}