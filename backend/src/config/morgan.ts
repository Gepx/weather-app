import { createWriteStream } from "node:fs";
import { validateEnv } from "./env.config.js";
import path from "path";
import morgan from "morgan";

const nodeEnv = validateEnv()?.env;

const getIPFormat = () => (nodeEnv === "production" ? ":remote-addr - " : "");

const accessLogStream = createWriteStream(
  path.join(__dirname, "..", "logs/access.log"),
  {
    flags: "a",
  },
);

const successResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
const successHandler = morgan(successResponseFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode >= 400,
});

const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
const errorHandler = morgan(errorResponseFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400,
});

export { successHandler, errorHandler };
