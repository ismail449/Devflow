import { error } from "console";

import mongoose, { ConnectOptions, Mongoose } from "mongoose";

const MONGOOSE_URI = process.env.MONGODB_URI;

if (!MONGOOSE_URI) {
  throw new Error("No MongoDB URI Was Found");
}

interface MongoosCache {
  conncetion: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongoosCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conncetion: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conncetion) {
    return cached.conncetion;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      dbName: "devflow",
    };

    cached.promise = mongoose
      .connect(MONGOOSE_URI, opts)
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB: ", error);
        throw error;
      });
  }

  cached.conncetion = await cached.promise;
  return cached.conncetion;
};

export default dbConnect;
