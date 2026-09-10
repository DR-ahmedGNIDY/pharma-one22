import mongoose from "mongoose";

/**
 * Importing the model barrel for its side effects registers every schema on the
 * mongoose singleton.
 *
 * Without this, `.populate("brand")` throws MissingSchemaError whenever the
 * module that runs the query never imported the Brand model itself — which
 * depends on route-level import order and so fails intermittently rather than
 * consistently.
 */
import "@/models";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pharma-one";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
