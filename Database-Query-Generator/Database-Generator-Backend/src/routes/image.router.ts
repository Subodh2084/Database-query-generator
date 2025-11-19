import { Router } from "express";
import upload from "../config/multer.config";
import handleImageSQLGeneratorController from "../controller/image.controller";

const imageRouter = Router();

imageRouter.post(
  "/prompt/image",
  upload.single("photo"),
  handleImageSQLGeneratorController
);

export default imageRouter;
