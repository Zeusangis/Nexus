import express from "express";
import * as car from "../controller/coach-athlete.controller";
import { authMiddleware, permissionMiddleware } from "../middleware";

const router = express.Router();

// Protected routes
router.post("/assign", authMiddleware, car.assignAthleteToCoach);
router.get("/coach/athletes", authMiddleware, car.getCoachAthletes);
router.get("/athlete/coaches", authMiddleware, car.getAthleteCoaches);
router.delete("/:id", authMiddleware, car.removeAthleteFromCoach);

// Admin only routes
router.get(
  "/",
  [authMiddleware, permissionMiddleware],
  car.getAllRelationships
);

export default router;
