import { model, models, Schema, Types, Document } from "mongoose";

export interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}
export type TagQuestionDoc = ITagQuestion & Document;
const tagQuestionSchema = new Schema<ITagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, required: true, ref: "Tag" },
    question: { type: Schema.Types.ObjectId, required: true, ref: "Question" },
  },
  { timestamps: true }
);

const TagQuestion =
  models.TagQuestion || model<ITagQuestion>("TagQuestion", tagQuestionSchema);

export default TagQuestion;
