import { Request, Response, NextFunction } from "express";
import { UnkownAny } from "../types/common.types";
import sqlLogger from "../libs/common.logger";
import PromptMapper from "../helpers/promptMapper.helper";
import { addDefaultIfNotExists } from "../utils/common.utils";
import { handlePromptServices } from "../services/prompt.service";
import sendAPIResponse from "../utils/response.utils";

async function promptController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.ip);
    const queryParams = addDefaultIfNotExists(req.query?.database as string);
     const promptRequest = req.body?.content as string;
     const promptMapper = new PromptMapper(
      queryParams,
      promptRequest
    ).getPromptMapper();
    const apiResponse = await handlePromptServices(
      promptMapper as Map<string, string>
    );
    const { data, message } = apiResponse;
    sendAPIResponse(res, data, message);
  } catch (err: UnkownAny) {
    sqlLogger.error(`Error While Generating the SQL Query From the LLM`);
    next(err);
  }
}

export { promptController };
