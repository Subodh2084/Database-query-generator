import { getEnvValue } from "../utils/env.utils";

const envConfig = Object.freeze({
  port: getEnvValue("PORT"),
});

export { envConfig };
