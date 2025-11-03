import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import prisma from "../db/prisma";
import {
  successResponse,
  errorResponse,
  zodErrorResponse,
} from "../utils/response";
import {
  createDailyLogSchema,
  updateDailyLogSchema,
  getDailyLogsSchema,
} from "../schema/daily-log.schema";
import { AuthRequest } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

// Helper function to check if user has permission to access athlete data
const hasAthleteAccess = async (
  userId: string,
  athleteId: string
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;

  // Athlete can only access their own data
  if (user.role === ("ATHLETE" as Role)) {
    const athleteProfile = await prisma.athleteProfile.findUnique({
      where: { userId: userId },
    });
    return athleteProfile?.id === athleteId;
  }

  // Coach can access their assigned athletes
  if (user.role === "COACH") {
    const relationship = await prisma.coachAthleteRelationship.findUnique({
      where: {
        coachId_athleteId: {
          coachId: userId,
          athleteId: athleteId,
        },
      },
    });
    return !!relationship;
  }

  return false;
};

export const createDailyLog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createDailyLogSchema.parse(req.body);
    const currentUserId = (req.user as any)?.userId;

    // Check if user has permission to create log for this athlete
    // const hasAccess = await hasAthleteAccess(
    //   currentUserId,
    //   validatedData.athleteId
    // );
    // if (!hasAccess) {
    //   return errorResponse(
    //     res,
    //     "You don't have permission to create logs for this athlete",
    //     null,
    //     403
    //   );
    // }

    // Check if athlete exists
    const athlete = await prisma.athleteProfile.findUnique({
      where: { id: validatedData.athleteId },
    });

    if (!athlete) {
      return errorResponse(res, "Athlete not found", null, 404);
    }

    // Check if log already exists for this date
    const logDate = validatedData.date
      ? new Date(validatedData.date)
      : new Date();
    const existingLog = await prisma.dailyLog.findFirst({
      where: {
        athleteId: validatedData.athleteId,
        date: {
          gte: new Date(logDate.setHours(0, 0, 0, 0)),
          lt: new Date(logDate.setHours(24, 0, 0, 0)),
        },
      },
    });

    if (existingLog) {
      return errorResponse(
        res,
        "Daily log already exists for this date",
        null,
        409
      );
    }

    const dailyLog = await prisma.dailyLog.create({
      data: {
        ...validatedData,
        date: logDate,
      },
      include: {
        athlete: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return successResponse(res, "Daily log created successfully", { dailyLog });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getDailyLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = getDailyLogsSchema.parse(req.query);
    const currentUserId = (req.user as any)?.userId;

    let whereClause: any = {};

    // If athleteId is provided, check permission
    if (validatedData.athleteId) {
      const hasAccess = await hasAthleteAccess(
        currentUserId,
        validatedData.athleteId
      );
      if (!hasAccess) {
        return errorResponse(
          res,
          "You don't have permission to view logs for this athlete",
          null,
          403
        );
      }
      whereClause.athleteId = validatedData.athleteId;
    } else {
      // If no athleteId provided, get all athletes the user has access to
      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true },
      });

      if (user?.role === ("ATHLETE" as Role)) {
        const athleteProfile = await prisma.athleteProfile.findUnique({
          where: { userId: currentUserId },
        });
        if (athleteProfile) {
          whereClause.athleteId = athleteProfile.id;
        }
      } else if (user?.role === "COACH") {
        const relationships = await prisma.coachAthleteRelationship.findMany({
          where: { coachId: currentUserId },
          select: { athleteId: true },
        });
        whereClause.athleteId = {
          in: relationships.map((rel) => rel.athleteId),
        };
      }
      // Admin can see all logs, no additional where clause needed
    }

    // Date range filter
    if (validatedData.startDate || validatedData.endDate) {
      whereClause.date = {};
      if (validatedData.startDate) {
        whereClause.date.gte = new Date(validatedData.startDate);
      }
      if (validatedData.endDate) {
        whereClause.date.lte = new Date(validatedData.endDate);
      }
    }

    const dailyLogs = await prisma.dailyLog.findMany({
      where: whereClause,
      include: {
        athlete: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return successResponse(res, "Daily logs fetched successfully", {
      dailyLogs,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const getDailyLogById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user as any)?.userId;

    const dailyLog = await prisma.dailyLog.findUnique({
      where: { id },
      include: {
        athlete: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!dailyLog) {
      return errorResponse(res, "Daily log not found", null, 404);
    }

    // Check if user has permission to view this log
    const hasAccess = await hasAthleteAccess(currentUserId, dailyLog.athleteId);
    if (!hasAccess) {
      return errorResponse(
        res,
        "You don't have permission to view this log",
        null,
        403
      );
    }

    return successResponse(res, "Daily log fetched successfully", { dailyLog });
  } catch (error) {
    next(error);
  }
};

export const updateDailyLog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateDailyLogSchema.parse(req.body);
    const currentUserId = (req.user as any)?.userId;

    // First get the existing log to check permissions
    const existingLog = await prisma.dailyLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      return errorResponse(res, "Daily log not found", null, 404);
    }

    // Check if user has permission to update this log
    const hasAccess = await hasAthleteAccess(
      currentUserId,
      existingLog.athleteId
    );
    if (!hasAccess) {
      return errorResponse(
        res,
        "You don't have permission to update this log",
        null,
        403
      );
    }

    const dailyLog = await prisma.dailyLog.update({
      where: { id },
      data: validatedData,
      include: {
        athlete: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return successResponse(res, "Daily log updated successfully", { dailyLog });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    next(error);
  }
};

export const deleteDailyLog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user as any)?.userId;

    // First get the existing log to check permissions
    const existingLog = await prisma.dailyLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      return errorResponse(res, "Daily log not found", null, 404);
    }

    // Check if user has permission to delete this log
    const hasAccess = await hasAthleteAccess(
      currentUserId,
      existingLog.athleteId
    );
    if (!hasAccess) {
      return errorResponse(
        res,
        "You don't have permission to delete this log",
        null,
        403
      );
    }

    await prisma.dailyLog.delete({
      where: { id },
    });

    return successResponse(res, "Daily log deleted successfully");
  } catch (error) {
    next(error);
  }
};
