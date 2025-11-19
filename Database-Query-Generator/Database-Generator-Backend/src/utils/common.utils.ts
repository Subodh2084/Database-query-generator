import { DatabaseConfig } from "../constant/database.constant";

const getObjectValue = (obj: any, key: string) => {
  if (key in obj) {
    return obj[key];
  }
  return null;
};

const addDefaultIfNotExists = (value: any, db = true): string => {
  if (!value && db) {
    return DatabaseConfig["mysql"] as string;
  } else {
    return value;
  }
};

const addEnabledDefault = (value: any) => {
  if ((["true", "false"].includes(value) && value) || !value) {
    return value;
  }
  if (typeof value !== "boolean" && !value) {
    return false;
  }
};

const concatDatabaseName = (prompt: string, dbName: string) => {
  if (!prompt.endsWith(`-${dbName}`)) {
    return prompt + `-${dbName}`;
  }
  return prompt;
};

const convertStringToBoolean = (value: string) => {
  switch (true) {
    case value.toLowerCase() === "true": {
      return true;
    }
    case value.toLowerCase() === "false": {
      return false;
    }
    default: {
      return Boolean(value);
    }
  }
};

const concatAllArgs = (
  prompt: string,
  dbName: string,
  isEnabledFlag: boolean
) => {
  let enabledDesc = isEnabledFlag ? "desc" : "not-desc";
  if (!prompt.endsWith(`-${enabledDesc}-${dbName}`)) {
    return prompt + `-${enabledDesc}-${dbName}`;
  }
  return prompt;
};

export {
  getObjectValue,
  addDefaultIfNotExists,
  concatDatabaseName,
  addEnabledDefault,
  concatAllArgs,
  convertStringToBoolean,
};
