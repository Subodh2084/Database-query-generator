/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import statusCode from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { HttpExceptions } from "../exceptions";
import sqlLogger from "../libs/common.logger";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof HttpExceptions) {
    res.status(error.getStatusCode()).json({
      message: error.getMessage(),
      error: true,
      statusCode: error.getStatusCode(),
    });
  }

  sqlLogger.error("Unhandled Error found. Error: " + error);

  res.status(statusCode.INTERNAL_SERVER_ERROR).json({
    message: "Unhandle Error Found: " + error?.message,
    error: true,
    statusCode: statusCode.INTERNAL_SERVER_ERROR,
  });
};
