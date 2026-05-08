import mongoose, { Schema, type Document } from "mongoose";

export interface IAnswer extends Document {
  questionId: mongoose.Types.ObjectId;
  authorName: string;
  body: string;
  createdAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  authorName: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Answer = mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);
export const answersTable = Answer;
export type Answer = IAnswer;

