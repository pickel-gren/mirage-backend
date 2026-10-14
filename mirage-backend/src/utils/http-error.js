export class HttpError extends Error {
  constructor(statusCode, message, code = "REQUEST_ERROR") {
    super(message);

    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace?.(this, HttpError);
  }
}