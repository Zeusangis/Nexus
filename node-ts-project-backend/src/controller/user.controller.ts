import { ZodError } from "zod";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma";
import { validatePassword, getHashedPassword } from "../utils/password";
import {
  errorResponse,
  successResponse,
  zodErrorResponse,
} from "../utils/response";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../schema/user.schema";
import { generateToken } from "../utils/token";
import { Role } from "@prisma/client";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) {
      return errorResponse(res, "User with this email already exists.");
    }

    // Create user
    const hashedPassword = await getHashedPassword(data.password);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        role: data.role as Role,
      },
    });

    // Create athlete profile if user is athlete
    let athleteProfileId: string | null = null;
    if (user.role === "ATHELETE") {
      const profile = await prisma.athleteProfile.create({
        data: {
          age: data.age,
          userId: user.id,
          height: data.height,
          weight: data.weight,
          bmi: data.bmi,
        },
      });
      athleteProfileId = profile.id;
    }

    return successResponse(res, "User registered successfully.", {
      id: user.id,
      athleteId: athleteProfileId,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      return errorResponse(res, "User not found.");
    }

    const isValid = await validatePassword(data.password, user.password);
    if (!isValid) {
      return errorResponse(res, "Invalid password.");
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return successResponse(res, "User logged in successfully.", {
      token,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return successResponse(res, "Users fetched successfully.", { users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        athleteProfile: true,
      },
    });
    if (!user) {
      return errorResponse(res, "User not found.", null, 404);
    }
    return successResponse(res, "User fetched successfully.", { user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) {
      return errorResponse(res, "User not found.", null, 404);
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    return successResponse(res, "User deleted successfully.");
  } catch (error) {
    next(error);
  }
};

interface CustomRequest extends Request {
  user: { userId: string };
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as JwtPayload).user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        athleteProfile: true,
      },
    });
    if (!user) {
      return errorResponse(res, "User not found.", null, 404);
    }
    return successResponse(res, "User fetched successfully.", { user });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { athleteProfile: true },
    });

    if (!user) {
      return errorResponse(res, "User not found.", null, 404);
    }

    const { fullName, email, age, gender, height, weight, bmi } = req.body;

    // Update user basic info
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName ?? user.fullName,
        email: email ?? user.email,
      },
    });

    // Update athlete profile (if athlete)
    if (user.role === "ATHELETE" && user.athleteProfile) {
      await prisma.athleteProfile.update({
        where: { userId },
        data: {
          age: age ?? user.athleteProfile.age,
          gender: gender ?? user.athleteProfile.gender,
          height: height ?? user.athleteProfile.height,
          weight: weight ?? user.athleteProfile.weight,
          bmi: bmi ?? user.athleteProfile.bmi,
        },
      });
    }

    return successResponse(res, "User updated successfully.");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = changePasswordSchema.parse(req.body);
    const userId = (req as JwtPayload).user.userId;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, "User not found.", null, 404);
    }

    // Verify current password
    const isValidPassword = await validatePassword(
      data.currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return errorResponse(res, "Current password is incorrect.", null, 401);
    }

    // Check if new password is different from current password
    const isSamePassword = await validatePassword(
      data.newPassword,
      user.password
    );
    if (isSamePassword) {
      return errorResponse(
        res,
        "New password must be different from current password."
      );
    }

    // Hash new password and update
    const hashedPassword = await getHashedPassword(data.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return successResponse(res, "Password changed successfully.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};
