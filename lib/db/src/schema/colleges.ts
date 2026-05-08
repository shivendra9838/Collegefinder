import mongoose, { Schema, type Document } from "mongoose";
import { createInsertSchema } from "drizzle-zod"; // Keep for compatibility if needed, or remove if not
import { z } from "zod/v4";

export interface ICollege extends Document {
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  totalFees: number;
  placementPercentage: number;
  avgPackage: number;
  established: number;
  imageUrl: string;
  coursesCount: number;
  topCourses: string[];
  nirf?: number;
  description: string;
  website: string;
  accreditation: string;
  totalStudents: number;
  facultyCount: number;
  hostelAvailable: boolean;
  scholarshipAvailable: boolean;
  examAccepted: string[];
  createdAt: Date;
}

const CollegeSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  type: { type: String, required: true },
  rating: { type: Number, default: 0 },
  totalFees: { type: Number, default: 0 },
  placementPercentage: { type: Number, default: 0 },
  avgPackage: { type: Number, default: 0 },
  established: { type: Number, required: true },
  imageUrl: { type: String, default: "" },
  coursesCount: { type: Number, default: 0 },
  topCourses: { type: [String], default: [] },
  nirf: { type: Number },
  description: { type: String, default: "" },
  website: { type: String, default: "" },
  accreditation: { type: String, default: "" },
  totalStudents: { type: Number, default: 0 },
  facultyCount: { type: Number, default: 0 },
  hostelAvailable: { type: Boolean, default: false },
  scholarshipAvailable: { type: Boolean, default: false },
  examAccepted: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const College = mongoose.models.College || mongoose.model<ICollege>("College", CollegeSchema);

// Drizzle compatibility exports (optional, depends on how much you want to change types)
export const collegesTable = College; // Alias for easier migration in some places
export type College = ICollege;

