import express from "express";
import * as sc from "../controller/sport.controller";
import { authMiddleware, permissionMiddleware } from "../middleware";

const router = express.Router();

// Public route (if you want categories to be publicly accessible)
router.get("/", sc.getSports);

// Protected routes (require authentication)
router.get("/:id", authMiddleware, sc.getSportById);
router.post("/", [authMiddleware, permissionMiddleware], sc.createSport);
router.put("/:id", [authMiddleware, permissionMiddleware], sc.updateSport);
router.delete("/:id", [authMiddleware, permissionMiddleware], sc.deleteSport);

export default router;
