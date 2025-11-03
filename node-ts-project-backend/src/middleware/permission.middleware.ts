import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import prisma from "../db/prisma";

interface DecodedToken {
  userId: string;
}

export const permissionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorResponse(res, "No token provided", null, 401);
      return;
    }

    const token = authHeader.split(" ")[1]; // Get token after 'Bearer '

    if (!token) {
      errorResponse(res, "No token provided", null, 401);
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      errorResponse(res, "User not found", null, 404);
      return;
    }

    const requestedUserId = req.params.id;

    // Allow COACH, ADMIN, or self-access
    if (
      user.role !== "COACH" &&
      user.role !== "ATHELETE" &&
      user.id !== requestedUserId
    ) {
      errorResponse(
        res,
        "Access denied: Coach, Admin or self-access only",
        null,
        403
      );
      return;
    }

    (req as JwtPayload).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(res, "Invalid or expired token", null, 401);
    } else {
      errorResponse(res, "Internal server error", null, 500);
    }
  }
};
