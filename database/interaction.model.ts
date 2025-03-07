import { model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
  action: string;
}

const interactionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, required: true, enum: ["question", "answer"] },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
