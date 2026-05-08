import mongoose, { Schema, type Document } from "mongoose";

export interface IReview extends Document {
  collegeId: mongoose.Types.ObjectId;
  reviewerName: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  category: { type: String, default: "Overall" },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export const reviewsTable = Review;
export type Review = IReview;

