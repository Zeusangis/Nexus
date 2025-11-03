import express from "express";
import * as ac from "../controller/athlete.controller";
import { authMiddleware, permissionMiddleware } from "../middleware";

const router = express.Router();

router.get("/", authMiddleware, ac.getAthletes);
router.delete("/:id", [authMiddleware, permissionMiddleware], ac.deleteAthlete);

export default router;
