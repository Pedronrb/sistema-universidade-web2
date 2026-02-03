import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError } from "./HttpError.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return next(new HttpError(401, "Token não fornecido"));

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return next(new HttpError(401, "Token inválido"));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // {id, nome, email, papeis}
    next();
  } catch (err) {
    return next(new HttpError(401, "Token inválido ou expirado"));
  }
};
