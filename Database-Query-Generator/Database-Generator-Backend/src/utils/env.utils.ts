import dotenv from "dotenv";
import e from "express";
import { env } from "process";
dotenv.config();

const getEnvValue = (key: string) => {
  const envValue = Object.prototype.hasOwnProperty.call(process.env, key)
    ? process.env[key]
    : null;

  if (!envValue) {
    throw new Error(`Env Value is Missing For this Key : ${key}`);
  }
  return envValue;
};

export { getEnvValue };
