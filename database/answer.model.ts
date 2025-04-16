import { model, models, Types, Schema, Document } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  upvotes?: number;
  downvotes?: number;
}
export type AnswerDoc = IAnswer & Document;
const questionSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Answer = models?.Answer || model<IAnswer>("Answer", questionSchema);

export default Answer;
