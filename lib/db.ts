// lib/db.ts

import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null; 
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined; 
}

const cached: MongooseCache = 
  global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

// 1. Get the URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// 2. CRITICAL CHECK: Enforce its presence and throw an error if missing
if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in .env.local or Vercel Environment Variables"
  );
}

// At this point, TypeScript knows MONGODB_URI is definitely a 'string'.
// We can assign it to a new constant for clarity, or use it directly.
const MONGODB_URI_STR: string = MONGODB_URI;


export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 3. FIX APPLIED: Pass the variable that is guaranteed to be a string
    // This will be the code on or near line 42 that fixes your error.
    cached.promise = mongoose.connect(MONGODB_URI_STR).then((mongooseInstance) => mongooseInstance);
  }
  
  cached.conn = await cached.promise;
  
  return cached.conn;
}
