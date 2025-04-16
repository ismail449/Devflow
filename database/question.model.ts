import { model, models, Schema, Types, Document } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  upvotes?: number;
  downvotes?: number;
  answerCount?: number;
  views?: number;
}
export type QuestionDoc = IQuestion & Document;
const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, required: true, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question =
  models?.Question || model<IQuestion>("Question", questionSchema);

export default Question;
