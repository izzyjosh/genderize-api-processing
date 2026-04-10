import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { genderizeService } from "../services/genderize.services";
import { successResponse } from "../utils/responses";

class GenderizeController {
  async classify(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const name = req.query.name as string;
      // Simulate processing logic (e.g., call to a service or database)
      const result = await genderizeService.classify(name);
      res.status(StatusCodes.OK).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export const genderizeController = new GenderizeController();
