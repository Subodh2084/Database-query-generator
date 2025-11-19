import sqlLogger from "./libs/common.logger";
import express from "express";
import { UnkownAny } from "./types/common.types";
import serverMiddleware from "./middlewares/server.middleware";
import serverRouter from "./routes/server.router";
import { envConfig } from "./config/env.config";
import { getObjectValue } from "./utils/common.utils";
import { initalizeRedisServer } from "./config/redis.config";

async function startExpressApp() {
  try {
    const app = express();
    await serverMiddleware(app);
    await serverRouter(app);
    initalizeRedisServer().then((status: boolean) => {
      if (status) {
        app.listen(getObjectValue(envConfig, "port"), () => {
          sqlLogger.info(
            `Server is Starting on the Port : http://localhost:${getObjectValue(
              envConfig,
              "port"
            )}`
          );
        });
      } else {
        throw new Error(`Database Connection Error, Redis Cannot be Connected`);
      }
    });
  } catch (err: UnkownAny) {
    sqlLogger.error(
      `Error Starting the Express App, Error : ${JSON.stringify(err)}`
    );
    process.exit(1);
  }
}

export default startExpressApp;
