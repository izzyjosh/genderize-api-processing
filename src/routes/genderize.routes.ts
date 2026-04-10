import { Router } from "express";
import { validateRequest } from "../utils/validate-request";
import { genderizeController } from "../controllers/genderize.controllers";

const genderizeRouter = Router();

genderizeRouter.get("/classify", validateRequest("name"), (req, res, next) => {
  genderizeController.classify(req, res, next);
});

export default genderizeRouter;
