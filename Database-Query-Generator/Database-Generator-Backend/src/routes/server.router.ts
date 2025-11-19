import { Application } from "express";
import healthRouter from "./health.router";
import { errorHandler } from "../middlewares/error.middelware";
import promptRouter from "./prompt.router";
import imageRouter from "./image.router";

async function serverRouter(app: Application) {
  app.use("/api/v1", healthRouter, promptRouter, imageRouter);
  app.use(errorHandler);
}

export default serverRouter;
