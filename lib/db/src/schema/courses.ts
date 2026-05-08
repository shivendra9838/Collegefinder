import mongoose, { Schema, type Document } from "mongoose";

export interface ICourse extends Document {
  collegeId: mongoose.Types.ObjectId;
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
}

const CourseSchema: Schema = new Schema({
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  fees: { type: Number, default: 0 },
  seats: { type: Number, default: 0 },
  eligibility: { type: String, default: "" },
});

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export const coursesTable = Course;
export type Course = ICourse;

