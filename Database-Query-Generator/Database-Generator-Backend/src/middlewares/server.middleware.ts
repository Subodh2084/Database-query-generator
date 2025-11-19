import express from "express";
import { Application } from "express";
import { errorHandler } from "./error.middelware";
import cors, { CorsOptions } from "cors";
import corsConfig from "../config/cors.config";

async function serverMiddleware(app: Application) {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cors(corsConfig as CorsOptions));
}

export default serverMiddleware;
