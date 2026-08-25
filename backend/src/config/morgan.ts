import { createWriteStream } from "node:fs";
import { mkdirSync } from "node:fs";
import { validateEnv } from "./env.config.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import morgan from "morgan";

const nodeEnv = validateEnv()?.env;

const getIPFormat = () => (nodeEnv === "production" ? ":remote-addr - " : "");

let successHandler;
let errorHandler;

if (nodeEnv === "production") {
  // Log to console in production
  const successResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
  successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
  });

  const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
  errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
  });
} else {
  // Log to file in development
  const logsDir = path.join(__dirname, "..", "logs");
  try {
    mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create logs directory:", err);
  }

  const accessLogStream = createWriteStream(path.join(logsDir, "access.log"), {
    flags: "a",
  });

  const successResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
  successHandler = morgan(successResponseFormat, {
    stream: accessLogStream,
    skip: (req, res) => res.statusCode >= 400,
  });

  const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
  errorHandler = morgan(errorResponseFormat, {
    stream: accessLogStream,
    skip: (req, res) => res.statusCode < 400,
  });
}

export { successHandler, errorHandler };
