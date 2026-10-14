import app from "./app.js";
import env from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(
    `🔆 Mirage backend listening on http://localhost:${env.port}`,
  );
});

function shutdown(signal) {
  console.log(`🛑 ${signal} received. Shutting down gracefully...`);

  server.close(async (error) => {
    if (error) {
      console.error("Error while closing HTTP server:", error);
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));