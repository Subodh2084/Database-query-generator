import PromptMapper from "../helpers/promptMapper.helper";
import { mysqlDatabase } from "../constant/database.constant";
import { nosqlDatabase } from "../constant/database.constant";
import { DatabaseException } from "../exceptions";
import { HTTP_STATUS } from "../constant/http-constant";
import GeminiHelper from "../helpers/gemini.helper";
import { modelResponseMapper } from "../mapper/model.mapper";
import sqlLogger from "../libs/common.logger";
import { getRedisClient } from "../config/redis.config";
import CryptoHelper from "../helpers/crypto.helper";
import RedisHelper from "../helpers/redis.helper";
import { concatDatabaseName, getObjectValue } from "../utils/common.utils";

async function handlePromptServices(promptMapper: Map<string, string>): Promise<
  Required<{
    data: any;
    message: string;
  }>
> {
  const geminiInstances = new GeminiHelper();
  const cryptoInstances = new CryptoHelper();
  const redisInstances = new RedisHelper();
  const dbName = promptMapper.get("database") as string;
  const prompt = promptMapper.get("prompt") as string;

  const isDbAvailable =
    Object.keys(mysqlDatabase).includes(dbName.trim().toLowerCase()) ||
    Object.keys(nosqlDatabase).includes(dbName.trim().toLowerCase());

  if (typeof isDbAvailable === "boolean" && !isDbAvailable) {
    throw new DatabaseException(
      HTTP_STATUS.DATABASE_ERROR.CODE,
      `The Database You Requested : ${dbName} Does not Available For this System`
    );
  }

  sqlLogger.info(`Processing the Query For the Database : ${dbName}`);

  const redisCient = await getRedisClient();

  const { valueExists, key } = await redisInstances.getUniqueRedisKey(
    concatDatabaseName(prompt, dbName),
    redisCient
  );

  if (typeof valueExists === "boolean" && valueExists) {
    sqlLogger.info(`Cache Hit.....`);
    const redisResponse = await redisCient.get(key);

    return {
      data: redisResponse,
      message: `The Data Fetches From the Cache Redis`,
    };
  }

  sqlLogger.info(`Cache Miss.....`);

  const modelResponse = await geminiInstances.generateSQLQuery(dbName, prompt);

  const normalizedResponse = modelResponseMapper(modelResponse as string);

  const setResult = await redisCient.setex(
    key,
    60 * 60 * 24,
    normalizedResponse
  );

  const isOkStatus =
    typeof setResult === "string" &&
    setResult.toString().trim().toLowerCase().includes("ok");

  if (!isOkStatus) {
    throw new DatabaseException(
      HTTP_STATUS.DATABASE_ERROR.CODE,
      `Error While Saving the Data in the Cache`
    );
  }

  return {
    data: normalizedResponse,
    message: `The Query Has been Generated SuccessFully`,
  };
}

export { handlePromptServices };
