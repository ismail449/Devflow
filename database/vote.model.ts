import { model, models, Schema, Types, Document } from "mongoose";

export interface IVote {
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
  id: Types.ObjectId;
  author: Types.ObjectId;
}
export type VoteDoc = IVote & Document;
const voteSchema = new Schema<IVote>(
  {
    type: { type: String, required: true, enum: ["question", "answer"] },
    voteType: { type: String, required: true, enum: ["upvote", "downvote"] },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", voteSchema);

export default Vote;
