import { Response } from "express";
import statusCodeMapper from "http-status-codes";

function sendAPIResponse<T>(
  res: Response,
  data: T,
  message: string,
  statusCode = statusCodeMapper.ACCEPTED
) {
  return res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    data: data,
    error: false,
  });
}

export default sendAPIResponse;
