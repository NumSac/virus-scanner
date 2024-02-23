import mongoose from "mongoose";
import { ConnectionOptions } from "tls";

export async function connectToMongo(): Promise<mongoose.Connection> {
  if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD) {
    console.error("[!] No mongo creds provided in env. Exiting...");
    process.exit(1);
  }
  const username = encodeURIComponent(process.env.MONGO_USER);
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const dbName = process.env.MONGO_DB_NAME;

  const uri = `mongodb://${username}:${password}@localhost:27017/${dbName}?authSource=admin`;

  return mongoose
    .connect(uri, {} as ConnectionOptions)
    .then(() => {
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "connection error:"));
      db.once("open", () => {
        console.log("[*] Database connected");
      });
      return db;
    })
    .catch((error) => {
      console.error("[!] Mongo Db error: ", error);
      throw error;
    });
}
