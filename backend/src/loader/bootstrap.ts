import { bootstrapExpress } from "./app.js";
import { logger } from "../config/logger.js";
import { validateEnv } from "../config/env.config.js";
import { connectToDB } from "../config/mongoose.js";
import type { Express } from "express";

export const bootstrap = async (app: Express) => {
  validateEnv();
  await connectToDB();
  bootstrapExpress(app);
  logger.info("Express app initiated.");
};
