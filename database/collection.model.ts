import { model, models, Schema, Types, Document } from "mongoose";

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}
export type CollectionDoc = ICollection & Document;
const collectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    question: { type: Schema.Types.ObjectId, required: true, ref: "Question" },
  },
  { timestamps: true }
);

const Collection =
  models?.Collection || model<ICollection>("Collection", collectionSchema);

export default Collection;
