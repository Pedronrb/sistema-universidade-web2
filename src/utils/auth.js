import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    papeis: user.papeis?.map(p => p.papel?.nome || p.papelNome) || []
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
