export function notFoundMiddleware(req, res) {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}