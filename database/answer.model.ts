import { model, models, Types, Schema, Document } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  upVotes?: number;
  downVotes?: number;
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
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Answer = models.Answer || model<IAnswer>("Answer", questionSchema);

export default Answer;
