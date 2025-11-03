import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export const generateToken = (payload: object, expiresIn = "1d") => {
  if (!jwtSecret) {
    throw new Error("JWT secret not defined");
  }
  return jwt.sign(payload, jwtSecret, { expiresIn });
};
