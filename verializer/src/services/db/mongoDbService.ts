import mongoose from "mongoose";
import { ConnectionOptions } from "tls";

// Add mongoose connection
export async function connectToMongo(): Promise<mongoose.Connection> {
  return mongoose
    .connect(`mongodb://localhost:27017/${process.env.MONGO_DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectionOptions)
    .then(() => {
      console.log("[*] Connected to Mongo");
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "connection error:"));
      db.once("open", () => {
        console.log("Database connected");
      });
      return db; // Return connection once established
    })
    .catch((error) => {
      console.error("[!] Mongo Db error: ", error);
      throw error;
    });
}
