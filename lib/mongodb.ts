// lib/db.ts
import mongoose from "mongoose";

// Define a type for cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global for hot reload support in Next.js
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Initialize cached connection
const cached: MongooseCache =
  global.mongooseCache || (global.mongooseCache = { conn: null, promise: null } as MongooseCache);

export async function dbConnect() {
  // Local constant ensures TypeScript knows this is definitely a string
  const MONGODB_URI: string = process.env.MONGODB_URI ?? "";
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in .env.local");
  }

  // Return cached connection if it exists
  if (cached.conn) return cached.conn;

  // Create a new connection if it doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
