import mongoose, { Schema, type Document } from "mongoose";

export interface IApplication extends Document {
  userId: string;
  collegeId: mongoose.Types.ObjectId;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

export const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
export type Application = IApplication;
