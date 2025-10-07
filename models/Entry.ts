// models/entry.ts

import mongoose, { Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface for the Entry document
// This interface describes the properties of a single password entry
export interface IEntry extends Document {
  website: string;
  username: string;
  password: string;
  notes?: string; // Optional field
  createdAt: Date;
}

// 2. Define the Mongoose Schema
const EntrySchema = new mongoose.Schema<IEntry>({
  website: {
    type: String,
    required: [true, 'Please provide a website name'],
    maxlength: [60, 'Website name cannot be more than 60 characters'],
  },
  username: {
    type: String,
    required: [true, 'Please provide a username or email'],
    maxlength: [60, 'Username cannot be more than 60 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 3. Define the Mongoose Model Type (for better intellisense)
// We cast the model to Model<IEntry>
const EntryModel = (mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema)) as Model<IEntry>;

export default EntryModel;