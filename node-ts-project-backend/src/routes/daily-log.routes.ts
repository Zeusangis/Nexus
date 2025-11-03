import express from "express";
import * as dlc from "../controller/daily-log.controller";
import { authMiddleware } from "../middleware";

const router = express.Router();

// All routes require authentication
router.post("/", authMiddleware, dlc.createDailyLog);
router.get("/", authMiddleware, dlc.getDailyLogs);
router.get("/:id", authMiddleware, dlc.getDailyLogById);
router.put("/:id", authMiddleware, dlc.updateDailyLog);
router.delete("/:id", authMiddleware, dlc.deleteDailyLog);

export default router;
