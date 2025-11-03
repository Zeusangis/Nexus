import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error("Error:", error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle Prisma errors
  if (error.name?.includes("Prisma") || error.message?.includes("Prisma")) {
    // Prisma unique constraint violation
    if (error.message?.includes("P2002")) {
      statusCode = 409;
      message = "A record with this data already exists.";
    }
    // Prisma record not found
    else if (error.message?.includes("P2025")) {
      statusCode = 404;
      message = "Record not found.";
    }
    // Prisma foreign key constraint failed
    else if (error.message?.includes("P2003")) {
      statusCode = 400;
      message = "Invalid reference to related record.";
    }
    // Other Prisma errors
    else {
      message = "Database error occurred.";
    }
  }

  // Handle common error types
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
  }

  // Development vs Production error response
  const isDevelopment = process.env.NODE_ENV === "development";

  const errorResponse = {
    success: false,
    message,
    ...(isDevelopment && {
      stack: error.stack,
      originalError: error.message,
    }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(statusCode).json(errorResponse);
};
