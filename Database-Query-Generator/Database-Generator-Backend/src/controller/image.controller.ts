import { NextFunction, Request, Response } from "express";
import { UnkownAny } from "../types/common.types";
import sqlLogger from "../libs/common.logger";
import { IFileContent } from "../interface/file.interface";
import {
  addDefaultIfNotExists,
  addEnabledDefault,
} from "../utils/common.utils";
import { handleDatabaseImagesService } from "../services/image.service";
import sendAPIResponse from "../utils/response.utils";

async function handleImageSQLGeneratorController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fileContent = req.file as Required<IFileContent>;
    const dbName = addDefaultIfNotExists(req.query?.database);
    const enabledDescription = addEnabledDefault(req.query?.enableDesc);
    const apiResponse = await handleDatabaseImagesService(fileContent, dbName,enabledDescription);
    const { data, message } = apiResponse;
    sendAPIResponse(res, data, message);
  } catch (err: UnkownAny) {
    sqlLogger.error(
      `Error Handling the Image You Have Provided,Error : ${err}`
    );
    next(err);
  }
}

export default handleImageSQLGeneratorController;
