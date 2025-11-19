import Redis from "ioredis";
import sqlLogger from "../libs/common.logger";

class RedisHelper {
  public redisKey: string;

  constructor() {
    this.redisKey = "prompt";
  }

  public generateKey(prompt: string) {
    let finalKey: string = "";
    if (!prompt.includes(":")) {
      prompt = prompt + ":" + this.redisKey;
      finalKey = finalKey.concat(prompt);
    }
    return finalKey;
  }

  public async getUniqueRedisKey(
    prompt: string,
    redisClient: Redis
  ): Promise<{
    valueExists: boolean;
    key: string;
  }> {
    return new Promise(async (resolve, reject) => {
      let valueExists = true;
      const key = this.generateKey(prompt);
      const redisValue = await redisClient.get(key);
      if (!redisValue) {
        sqlLogger.info(
          `The Key Does not Exist, Creating the Key on the Redis Database `
        );
        valueExists = false;
      }
      resolve({ valueExists, key });
    });
  }

  public async saveUserPrompts(
    prompt: string,
    userKey: string,
    redisClient: Redis
  ) {
    const result = await redisClient.setex(userKey, 60 * 60 * 24, prompt);
    return result.toLowerCase().includes("ok");
  }
}

export default RedisHelper;
