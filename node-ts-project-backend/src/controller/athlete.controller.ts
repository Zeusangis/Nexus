import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma";
import { successResponse, errorResponse } from "../utils/response";
import { NotFoundError } from "../utils/api-error";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAthletes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)?.userId;

    if (!userId) {
      return errorResponse(res, "User not authenticated", null, 401);
    }

    // Get the requesting user's role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    let athletes;

    // If user is a COACH, only show athletes assigned to them
    if (user.role === "COACH") {
      const coachAthleteRelationships =
        await prisma.coachAthleteRelationship.findMany({
          where: { coachId: userId },
          include: {
            athlete: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                isActive: true,
                athleteProfile: true,
              },
            },
          },
        });

      // Map to get athlete profiles with user info
      athletes = coachAthleteRelationships.map((relation) => ({
        ...relation.athlete.athleteProfile,
        user: {
          email: relation.athlete.email,
          fullName: relation.athlete.fullName,
          role: relation.athlete.role,
          isActive: relation.athlete.isActive,
        },
        assignedDate: relation.assignedDate,
      }));
    } else {
      // For non-coach users (admin, athlete, etc.), show all athletes
      athletes = await prisma.athleteProfile.findMany({
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              role: true,
              isActive: true,
            },
          },
        },
      });
    }

    return successResponse(res, "Athletes fetched successfully.", { athletes });
  } catch (error) {
    next(error);
  }
};

export const deleteAthlete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const athleteProfile = await prisma.athleteProfile.findUnique({
      where: { id: req.params.id },
    });

    if (!athleteProfile) {
      throw new NotFoundError("Athlete not found");
    }

    await prisma.athleteProfile.delete({
      where: { id: req.params.id },
    });

    await prisma.user.delete({
      where: { id: athleteProfile.userId },
    });

    return successResponse(res, "Athlete deleted successfully.");
  } catch (error) {
    next(error);
  }
};
