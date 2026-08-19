import CustomAPIError, { ErrorCode } from "./custom.error.js";

class InternalserverError extends CustomAPIError {
  statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 500);
    this.statusCode = 500;
  }
}

export default InternalserverError;
