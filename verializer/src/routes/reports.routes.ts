import express, { Router } from "express";

import {
  downloadReport,
  getReport,
  getReports,
} from "../controllers/reports.controllers";

const reportsRouter: Router = express.Router();

reportsRouter.route("/").get(getReports);

reportsRouter.route("/:id").get(getReport);

reportsRouter.route("/:id/download").get(downloadReport);

export default reportsRouter;
