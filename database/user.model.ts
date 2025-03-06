import { model, models, Schema } from "mongoose";

export interface IUser {
  nama: string;
  userName: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

const userSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = models?.user || model<IUser>("User", userSchema);
export default User;
