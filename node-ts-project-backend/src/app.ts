import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import routes from "./routes";
import { frontendUrl } from "./config";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/errorHandler";
import { loggerMiddleware, limiter } from "./middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Support multiple frontend URLs for development
const allowedOrigins = [
  frontendUrl,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api", limiter);
app.use(loggerMiddleware);

// API Endpoints
app.use("/api/v1/users", routes.userRoutes);
app.use("/api/v1/athlete", routes.athleteRoutes);
app.use("/api/v1/sport", routes.sportRoutes);
app.use("/api/v1/coach-athlete", routes.coachAthleteRoutes);
app.use("/api/v1/daily-logs", routes.dailyLogRoutes);

//For Unmatched Routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
