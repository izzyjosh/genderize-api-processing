import express from "express";
import dotenv from "dotenv";
import sysLogger, { httpLogger } from "./utils/logger";
import {
  NotFoundErrorHandler,
  RequestErrorHandler,
} from "./middlewares/errors.handlers";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(httpLogger);

app.get("/", (req, res) => {
  const response = {
    status: "success",
    message: "Welcome to the Genderize API Processing Service!",
  };
  res.status(StatusCodes.OK).json(response);
});

// Error handlers middlewares
app.use(NotFoundErrorHandler);
app.use(RequestErrorHandler);

app.listen(port, () => {
  sysLogger.info(`Server is running on port ${port}`);
});
