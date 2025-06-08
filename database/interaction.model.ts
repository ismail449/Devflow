import { model, models, Schema, Types, Document } from "mongoose";

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;
export interface IInteraction {
  user: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
  action: (typeof InteractionActionEnums)[number];
}

export type InteractionDoc = IInteraction & Document;

const interactionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, required: true, enum: ["question", "answer"] },
    action: {
      type: String,
      enum: InteractionActionEnums,
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
