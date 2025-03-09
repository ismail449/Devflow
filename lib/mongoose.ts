import mongoose, { ConnectOptions, Mongoose } from "mongoose";

import logger from "./logger";

const MONGOOSE_URI = process.env.MONGODB_URI;

if (!MONGOOSE_URI) {
  throw new Error("No MongoDB URI Was Found");
}

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.connection) {
    logger.info("Using existing MongoDB connection");
    return cached.connection;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      dbName: "devflow",
    };

    cached.promise = mongoose
      .connect(MONGOOSE_URI, opts)
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB: ", error);
        throw error;
      });
  }

  cached.connection = await cached.promise;
  return cached.connection;
};

export default dbConnect;
