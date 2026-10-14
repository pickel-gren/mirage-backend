export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : error.code || "Request error",
    message:
      statusCode === 500
        ? "An unexpected error occurred"
        : error.message,
  });
}