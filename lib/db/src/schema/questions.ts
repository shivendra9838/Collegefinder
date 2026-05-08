import mongoose, { Schema, type Document } from "mongoose";

export interface IQuestion extends Document {
  collegeId: mongoose.Types.ObjectId;
  authorName: string;
  title: string;
  body: string;
  category: string;
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now },
});

export const Question = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export const questionsTable = Question;
export type Question = IQuestion;

