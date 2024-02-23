import catchAsync from "../utils/catchAsync";
import upload from "../utils/fileUpload";
import express, { Router } from "express";
import {
  renderUpload,
  submitUpload,
} from "../controllers/submissions.controllers";

const submissionsRouter: Router = express.Router();

submissionsRouter
  .route("/")
  .get(renderUpload)
  .post(upload.single("file"), catchAsync(submitUpload));

export default submissionsRouter;
