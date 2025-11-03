import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../db/prisma";
import {
  successResponse,
  errorResponse,
  zodErrorResponse,
} from "../utils/response";
import {
  createSportsCategorySchema,
  updateSportsCategorySchema,
} from "../schema/sport.schema";

export const getSports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sportCategories = await prisma.sportsCategory.findMany({
      orderBy: { name: "asc" },
    });
    return successResponse(res, "Categories fetched successfully", {
      sportCategories,
    });
  } catch (error) {
    next(error);
  }
};

export const getSportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sportCategory = await prisma.sportsCategory.findUnique({
      where: { id },
      include: {
        athletes: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!sportCategory) {
      return errorResponse(res, "Sports category not found", null, 404);
    }

    return successResponse(res, "Sports category fetched successfully", {
      sportCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const createSport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createSportsCategorySchema.parse(req.body);

    const sportCategory = await prisma.sportsCategory.create({
      data: {
        name: validatedData.name,
      },
    });

    return successResponse(res, "Sports category created successfully", {
      sportCategory,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse(
        res,
        "A sports category with this name already exists",
        null,
        409
      );
    }
    next(error);
  }
};

export const updateSport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateSportsCategorySchema.parse(req.body);

    // Check if sport category exists
    const existingCategory = await prisma.sportsCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return errorResponse(res, "Sports category not found", null, 404);
    }

    const sportCategory = await prisma.sportsCategory.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
    });

    return successResponse(res, "Sports category updated successfully", {
      sportCategory,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(res, error);
    }
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse(
        res,
        "A sports category with this name already exists",
        null,
        409
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return errorResponse(res, "Sports category not found", null, 404);
    }
    next(error);
  }
};

export const deleteSport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if sport category exists
    const existingCategory = await prisma.sportsCategory.findUnique({
      where: { id },
      include: {
        athletes: {
          select: { id: true },
        },
      },
    });

    if (!existingCategory) {
      return errorResponse(res, "Sports category not found", null, 404);
    }

    // Check if category has associated athletes
    if (existingCategory.athletes.length > 0) {
      return errorResponse(
        res,
        "Cannot delete sports category with associated athletes. Please reassign or remove the athletes first.",
        null,
        400
      );
    }

    await prisma.sportsCategory.delete({
      where: { id },
    });

    return successResponse(res, "Sports category deleted successfully");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to delete not found")
    ) {
      return errorResponse(res, "Sports category not found", null, 404);
    }
    next(error);
  }
};
