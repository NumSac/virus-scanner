import express, { Router } from "express";

const reportsRouter: Router = express.Router();

reportsRouter.route("/").get();

reportsRouter.route("/:id").get();

reportsRouter.route("/:id/download").get();

export default reportsRouter;
