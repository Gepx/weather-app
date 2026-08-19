import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "../routes/index.route.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { corsOptions } from "../config/corsOptions.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware, {
  notFoundMiddleware,
} from "../middlewares/index.middleware.js";
import { errorHandler, successHandler } from "../config/morgan.js";

dotenv.config();

export const bootstrapExpress = (app: any) => {
  app.use(successHandler);
  app.use(errorHandler);
  app.use(ExpressMongoSanitize());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(helmet.xssFilter());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequest: [],
      },
    }),
  );

  app.use(cors());
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: false, limit: "30mb" }));
  app.use(cookieParser());

  // Route (API)
  app.use("/api", router);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
};
