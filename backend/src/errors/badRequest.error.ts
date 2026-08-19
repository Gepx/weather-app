import CustomAPIError, { ErrorCode } from "./custom.error.js";

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400);
    this.statusCode = 400;
  }
}

export default BadRequestError;
