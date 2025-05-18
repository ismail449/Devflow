import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
  actionId: Types.ObjectId;
  author: Types.ObjectId;
}
export type VoteDoc = IVote & Document;
const VoteSchema = new Schema<IVote>(
  {
    actionType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
