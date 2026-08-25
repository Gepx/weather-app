import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { logger } from "./config/logger.js";
import { validateEnv } from "./config/env.config.js";
import { bootstrapExpress } from "./loader/app.js";
import { connectToDB } from "./config/mongoose.js";
import mongoose from "mongoose";

const app: Express = express();

validateEnv();
bootstrapExpress(app);

connectToDB().catch((err) => {
  logger.error("Failed to connect to DB on startup", err);
});

mongoose.connection.on("error", (err) => {
  console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`);
});

export default app;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const port = process.env.PORT || 8080;
  const httpServer = createServer(app);

  const server: Server = httpServer.listen(port, () => {
    logger.info(`server listening on port ${port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(async () => {
        logger.info("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unExpectedErrorHandler = (error: Error) => {
    logger.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unExpectedErrorHandler);
  process.on("unhandledRejection", unExpectedErrorHandler);
  process.on("SIGTERM", () => {
    logger.info("SIGTERM recieved");
    if (server) {
      server.close();
    }
  });
}
