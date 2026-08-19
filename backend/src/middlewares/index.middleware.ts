import type { NextFunction, Request, Response } from "express";
import CustomAPIError from "../errors/custom.error.js";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const defaultError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again later",
  };
  if (err instanceof CustomAPIError) {
    return res
      .status(defaultError.statusCode)
      .json({ message: defaultError.msg, sucess: false });
  }
  if (err.name === "ValidationError") {
    defaultError.statusCode = 500;
    defaultError.msg = Object.values(err.errors)
      .map((item: any) => item?.message)
      .join(",");
  }
  if (err.name === "CastError") {
    defaultError.statusCode = 400;
    defaultError.msg = `Resourse not found. Invalid :${err.path}`;
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }
  res
    .status(defaultError.statusCode)
    .json({ message: defaultError.msg, sucess: false });
};

export default errorHandlerMiddleware;
