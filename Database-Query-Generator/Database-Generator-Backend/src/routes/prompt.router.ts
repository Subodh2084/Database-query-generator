import { Router } from "express";
import { promptController } from "../controller/prompt.controller";

const promptRouter = Router();

promptRouter.post("/prompt/query-generator", promptController);

export default promptRouter;
