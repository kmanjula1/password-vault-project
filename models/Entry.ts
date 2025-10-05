// models/Entry.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEntry extends Document {
  userId: string;
  title: string;
  username: string;
  password: string; // encrypted
  url?: string;
  notes?: string;
}

const EntrySchema: Schema = new Schema<IEntry>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
});

export default models.Entry || model<IEntry>("Entry", EntrySchema);