import express, { Request, Response, Express, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

import { connectToMongo } from "./services/db/mongoDbService";
import submissionsRouter from "./routes/submission.routes";

import sessionConfig from "./config/sessionConfig";

import session from "express-session";
import reportsRouter from "./routes/reports.routes";

dotenv.config();

// Initialize Express and env variables
const app: Express = express();
const port = process.env.PORT || 8000;

async function startServer() {
  try {
    // Configure express
    app.set("view engine", "pug");
    app.set("views", __dirname + "/views");
    app.use(session(sessionConfig));

    // Connect to Mongo
    await connectToMongo();

    // App routes

    app.use("/upload", submissionsRouter);
    app.use("/reports", reportsRouter);

    app.get(["/", "/home"], (req: Request, res: Response) => {
      res.render("index");
    });

    app.use(
      (err: any, req: Request, res: Response, next: NextFunction): any => {
        const { statusCode = 500 } = err;
        if (!err.message) err.message = "Something went wrong";
        res.status(statusCode).render("error", { err });
      }
    );

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[!] Unhandled error while executing app: ", error);
    //process.exit(1)
  }
}

startServer();
