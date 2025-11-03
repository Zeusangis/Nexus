import express from "express";
import * as uc from "../controller/user.controller";
import { authMiddleware, permissionMiddleware } from "../middleware";

const router = express.Router();

router.post("/register", uc.register);
router.post("/login", uc.login);
router.get("/me", authMiddleware, uc.getMe);
router.patch("/change-password", authMiddleware, uc.changePassword);
router.get("/", authMiddleware, uc.getUsers);
router.get("/:id", [authMiddleware], uc.getUserById);
router.patch("/:id", [authMiddleware], uc.editUser);
router.delete("/:id", [authMiddleware, permissionMiddleware], uc.deleteUser);

export default router;
