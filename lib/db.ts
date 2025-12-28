import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in environment variables");
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

if (!global.__mongooseConn) {
  global.__mongooseConn = { conn: null, promise: null };
}

export default async function connectDB() {
  if (global.__mongooseConn!.conn) {
    return global.__mongooseConn!.conn;
  }

  if (!global.__mongooseConn!.promise) {
    console.log("⚡ Connecting to MongoDB...");

    global.__mongooseConn!.promise = mongoose.connect(MONGODB_URI, {
      // production-level recommended options
      autoIndex: true,          // build indexes (off in huge DBs)
      maxPoolSize: 15,          // good for node servers
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then((mongoose) => {
      console.log("🚀 MongoDB connected");
      return mongoose;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      global.__mongooseConn!.promise = null;
      throw err;
    });
  }

  global.__mongooseConn!.conn = await global.__mongooseConn!.promise;
  return global.__mongooseConn!.conn;
}
