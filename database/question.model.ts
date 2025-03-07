import { model, models, Schema, Types } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  authorId: Types.ObjectId;
  upVotes?: number;
  downVotes?: number;
  answerCount?: number;
  views?: number;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, required: true, ref: "Tag" }],
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question =
  models.Question || model<IQuestion>("Question", questionSchema);

export default Question;
