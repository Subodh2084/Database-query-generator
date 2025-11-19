import { IFileContent } from "../interface/file.interface";
import processFileValidation from "../libs/validation.libs";
import { DatabaseException, HttpExceptions } from "../exceptions";
import { HTTP_STATUS } from "../constant/http-constant";
import TesseractHelper from "../helpers/extract.helper";
import RedisHelper from "../helpers/redis.helper";
import {
  concatAllArgs,
  concatDatabaseName,
  convertStringToBoolean,
} from "../utils/common.utils";
import { getRedisClient } from "../config/redis.config";
import sqlLogger from "../libs/common.logger";
import GeminiHelper from "../helpers/gemini.helper";
import { modelResponseMapper } from "../mapper/model.mapper";

async function handleDatabaseImagesService(
  fileContent: IFileContent,
  dbName: string,
  enabledDescription: boolean
): Promise<
  Required<{
    data: any;
    message: string;
  }>
> {
  const redisClient = await getRedisClient();
  const tesseractInstance = new TesseractHelper();
  const redisInstances = new RedisHelper();
  const geminiInstances = new GeminiHelper();
  return processFileValidation(fileContent).then((status: boolean) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { path, originalname } = fileContent;
        enabledDescription =
          typeof enabledDescription === "string"
            ? convertStringToBoolean(enabledDescription)
            : enabledDescription;

        sqlLogger.info(
          `The Enabled Description Flag is : ${enabledDescription}`
        );

        const { valueExists, key } = await redisInstances.getUniqueRedisKey(
          concatAllArgs(originalname, dbName, enabledDescription),
          redisClient
        );

        if (typeof valueExists === "boolean" && valueExists) {
          sqlLogger.info(`Cache Hit....`);

          const redisResponse = await redisClient.get(key);

          resolve({
            data: JSON.parse(redisResponse as string),
            message: `The Response Has been Fetches From the Cache`,
          });
          return;
        }

        sqlLogger.info(`Cache Miss....`);

        const ocrResponse = await tesseractInstance.extractTextFromImage(path);

        const modelResponse = await geminiInstances.generateSQLQuery(
          dbName as string,
          ocrResponse as string,
          true
        );

        const modelDescriptionResponse = enabledDescription
          ? await geminiInstances.generateSQLQueryDescription(
              dbName as string,
              ocrResponse as string
            )
          : null;

        const normalizedResponse = modelResponseMapper(modelResponse as string);

        const modelPayload = {
          modelResponse: normalizedResponse,
          issueDescription: enabledDescription
            ? modelResponseMapper(modelDescriptionResponse as string)
            : null,
        } as any;

        if (
          ("issueDescription" as string) in modelPayload &&
          !modelPayload["issueDescription"] &&
          !enabledDescription
        ) {
          delete modelPayload["issueDescription"];
        }

        const setResult = await redisClient.setex(
          key,
          60 * 60 * 24,
          JSON.stringify(Object.preventExtensions(modelPayload))
        );

        const isValidSetResult =
          typeof setResult === "string" &&
          setResult.trim().toLowerCase().includes("ok");

        if (!isValidSetResult) {
          throw new DatabaseException(
            HTTP_STATUS.DATABASE_ERROR.CODE,
            `The Redis Cannot Save the Model Response`
          );
        }

        resolve({
          data: modelPayload,
          message: "The Query Has been Corrected and Generated",
        });
      } catch (err: any) {
        throw new HttpExceptions(HTTP_STATUS.BAD_REQUEST.CODE, err.message);
      }
    });
  });
}

export { handleDatabaseImagesService };
