import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEnvValue } from "../utils/env.utils";
import { UnkownAny } from "../types/common.types";
import sqlLogger from "../libs/common.logger";
import {
  sqlCorrectionPrompt,
  sqlIssueExplanationPrompt,
  sqlPrompt,
} from "../constant/prompt.constant";

class GeminiHelper {
  public genAi: GoogleGenerativeAI;

  constructor() {
    this.genAi = new GoogleGenerativeAI(getEnvValue("GEMINI_API_KEY"));
  }

  public async getInitialModel() {
    return this.genAi.getGenerativeModel({
      model: getEnvValue("MODEL_NAME"),
    });
  }

  public async generateSQLQueryDescription(
    databaseName: string,
    query: string
  ) {
    let retryCount = 5;
    let retryStatus = true;
    while (retryCount > 0 && retryStatus) {
      try {
        const prompt = sqlIssueExplanationPrompt({
          dbName: databaseName,
          incorrectQuery: query,
        });
        const model = await this.getInitialModel();
        const generatedContent = await model.generateContent(prompt);
        const modelResponse = generatedContent.response.text();
        return modelResponse;
      } catch (err: UnkownAny) {
        const isMaximumExceeded = retryCount.toString().startsWith("0");
        if (isMaximumExceeded) {
          sqlLogger.info(
            `Maximum Retry Has been Exceeded, Cancelling the Model Request`
          );
          return {
            message: "Maximum Request Exceeded ",
          };
        }

        sqlLogger.error(
          `Error Generating the SQL Query Request From the Model`
        );

        sqlLogger.info(
          `Retrying the Request, Count: ${
            retryCount - 1
          } and RetryStatus: ${retryStatus}`
        );

        retryCount = retryCount - 1;
        continue;
      }
    }
  }

  public async generateSQLQuery(
    databaseName: string,
    query: string,
    isImage = false
  ) {
    let createPromptBasedOnDbName = "";
    let retryCount = 5;
    let retryStatus = true;

    while (retryCount > 0 && retryStatus) {
      try {
        if (isImage) {
          createPromptBasedOnDbName = sqlCorrectionPrompt({
            dbName: databaseName as string,
            incorrectQuery: query as string,
          });
        } else {
          createPromptBasedOnDbName = sqlPrompt({
            dbName: databaseName,
            userQuery: query,
          });
        }

        const model = await this.getInitialModel();
        const generatedContent = await model.generateContent(
          createPromptBasedOnDbName
        );
        const modelResponse = generatedContent.response.text();
        return modelResponse;
      } catch (err: UnkownAny) {
        const isMaximumExceeded = retryCount.toString().startsWith("0");
        if (isMaximumExceeded) {
          sqlLogger.info(
            `Maximum Retry Has been Exceeded, Cancelling the Model Request`
          );
          return {
            message: "Maximum Request Exceeded ",
          };
        }

        sqlLogger.error(
          `Error Generating the SQL Query Request From the Model`
        );

        sqlLogger.info(
          `Retrying the Request, Count: ${
            retryCount - 1
          } and RetryStatus: ${retryStatus}`
        );

        retryCount = retryCount - 1;
        continue;
      }
    }
  }
}

export default GeminiHelper;
