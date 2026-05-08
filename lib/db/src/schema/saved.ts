import mongoose, { Schema, type Document } from "mongoose";

export interface ISavedCollege extends Document {
  userId: string;
  collegeId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedCollegeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SavedCollege = mongoose.models.SavedCollege || mongoose.model<ISavedCollege>("SavedCollege", SavedCollegeSchema);
export const savedCollegesTable = SavedCollege;
export type SavedCollege = ISavedCollege;

export interface ISavedComparison extends Document {
  userId: string;
  name: string;
  collegeIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const SavedComparisonSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  collegeIds: [{ type: Schema.Types.ObjectId, ref: "College" }],
  createdAt: { type: Date, default: Date.now },
});

export const SavedComparison = mongoose.models.SavedComparison || mongoose.model<ISavedComparison>("SavedComparison", SavedComparisonSchema);
export const savedComparisonsTable = SavedComparison;
export type SavedComparison = ISavedComparison;

