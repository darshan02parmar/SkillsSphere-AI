import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      "MongoDB Connection Error: Missing MONGO_URI (or MONGODB_URI) in environment variables."
    );
    console.error(
      "Create `server/.env` and set MONGO_URI=<your_mongodb_connection_string>."
    );
    process.exit(1);
  }

  // Some Windows/corporate DNS resolvers fail SRV lookups for mongodb+srv (querySrv ECONNREFUSED).
  if (mongoUri.startsWith("mongodb+srv://") && process.platform === "win32") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    dns.setDefaultResultOrder("ipv4first");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected Successfully! : ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;