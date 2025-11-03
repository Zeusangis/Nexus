import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import prisma from "../db/prisma";
import {
  successResponse,
  errorResponse,
  zodErrorResponse,
} from "../utils/response";
import {
  assignAthleteSchema,
  getRelationshipsSchema,
} from "../schema/coach-athlete.schema";
import { AuthRequest } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const assignAthleteToCoach = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = assignAthleteSchema.parse(req.body);
    const coachId = validatedData.coachId || (req.user as any)?.userId;

    if (!coachId) {
      return errorResponse(res, "Coach ID is required", null, 400);
    }

    // Check if coach exists and is actually a coach
    const coach = await prisma.user.findUnique({
      where: {
        id: coachId,
        role: "COACH",
      },
    });

    if (!coach) {
      return errorResponse(
        res,
        "Coach not found or user is not a coach",
        null,
        404
      );
    }

    // Check if athlete exists
    const athlete = await prisma.user.findUnique({
      where: {
        id: validatedData.athleteId,
        role: "ATHELETE" as Role,
      },
    });

    if (!athlete) {
      return errorResponse(
        res,
        "Athlete not found or user is not an athlete",
        null,
        404
      );
    }

    // Check if relationship already exists
    const existingRelationship =
      await prisma.coachAthleteRelationship.findUnique({
        where: {
          coachId_athleteId: {
            coachId,
            athleteId: validatedData.athleteId,
          },
        },
      });

    if (existingRelationship) {
      return errorResponse(
        res,
        "Athlete is already assigned to this coach",
        null,
        409
      );
    }

    // Create the relationship
    const relationship = await prisma.coachAthleteRelationship.create({
      data: {
        coachId,
        athleteId: validatedData.athleteId,
      },
      include: {
        coach: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        athlete: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return successResponse(res, "Athlete assigned to coach successfully", {
      relationship,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getCoachAthletes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coachId } = getRelationshipsSchema.parse(req.query);
    const currentCoachId = coachId || (req.user as any)?.userId;

    if (!currentCoachId) {
      return errorResponse(res, "Coach ID is required", null, 400);
    }

    const relationships = await prisma.coachAthleteRelationship.findMany({
      where: { coachId: currentCoachId },
      include: {
        athlete: {
          select: {
            id: true,
            fullName: true,
            email: true,
            athleteProfile: {
              select: {
                age: true,
                height: true,
                weight: true,
                sport: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { assignedDate: "desc" },
    });

    return successResponse(res, "Coach athletes fetched successfully", {
      relationships,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getAthleteCoaches = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { athleteId } = getRelationshipsSchema.parse(req.query);
    const currentAthleteId = athleteId || (req.user as any)?.userId;

    if (!currentAthleteId) {
      return errorResponse(res, "Athlete ID is required", null, 400);
    }

    const relationships = await prisma.coachAthleteRelationship.findMany({
      where: { athleteId: currentAthleteId },
      include: {
        coach: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { assignedDate: "desc" },
    });

    return successResponse(res, "Athlete coaches fetched successfully", {
      relationships,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const removeAthleteFromCoach = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // relationship ID

    const relationship = await prisma.coachAthleteRelationship.findUnique({
      where: { id },
    });

    if (!relationship) {
      return errorResponse(
        res,
        "Coach-athlete relationship not found",
        null,
        404
      );
    }

    // Optional: Check if current user has permission to delete this relationship
    const currentUserId = (req.user as any)?.userId;
    if (relationship.coachId !== currentUserId) {
      return errorResponse(
        res,
        "You can only remove athletes from your own coaching",
        null,
        403
      );
    }

    await prisma.coachAthleteRelationship.delete({
      where: { id },
    });

    return successResponse(res, "Athlete removed from coach successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getAllRelationships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const relationships = await prisma.coachAthleteRelationship.findMany({
      include: {
        coach: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        athlete: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { assignedDate: "desc" },
    });

    return successResponse(
      res,
      "All coach-athlete relationships fetched successfully",
      { relationships }
    );
  } catch (error) {
    next(error);
  }
};
