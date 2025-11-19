import Redis from "ioredis";
import { UnkownAny } from "../types/common.types";
import sqlLogger from "../libs/common.logger";


async function initalizeRedisServer(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    let connectionStatus = false;
    try {
      const client = new Redis();
      await client.flushall();
      client.on("connect", () => {
        sqlLogger.info(`Redis Has been Connected Successfully`);
      });

      client.on("error", (err) => {
        sqlLogger.error(`Redis Has not been Connected Successfully`);
        throw err;
      });
      connectionStatus = true;
      resolve(connectionStatus);
    } catch (err: UnkownAny) {
      sqlLogger.error(`Error Connecting to the Redis Server, Error : ${err}`);
      reject(connectionStatus);
    }
  });
}

async function getRedisClient(): Promise<Redis> {
  const client = new Redis();
  return client;
}

export { initalizeRedisServer, getRedisClient };
