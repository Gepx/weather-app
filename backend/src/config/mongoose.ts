import { connect, set } from "mongoose";
import { validateEnv } from "../config/env.config.js";

const envVars = validateEnv();
const MONGO_DB_URI = envVars?.MONGO_DB_URI ?? "";

export const connectToDB = async () => {
  try {
    set("strictQuery", false);
    const db = await connect(MONGO_DB_URI);
    console.log("MongoDB connected to", db.connection.name);
  } catch (error) {
    console.error(error);
  }
};
