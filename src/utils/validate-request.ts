import { NextFunction, Request, Response } from "express";
import { ValidationError, BadRequestError } from "./api.errors";

const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;

export const validateRequest =
  (queryKey: string = "name") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const queryValue = req.query[queryKey];

    if (queryValue === undefined) {
      throw new BadRequestError("Missing or empty name parameter");
    }

    if (Array.isArray(queryValue) || typeof queryValue !== "string") {
      throw new ValidationError("name is not a string");
    }

    const trimmedValue = queryValue.trim();
    if (!trimmedValue) {
      throw new BadRequestError("Missing or empty name parameter");
    }

    if (NUMERIC_PATTERN.test(trimmedValue)) {
      throw new ValidationError("name is not a string");
    }

    next();
  };
