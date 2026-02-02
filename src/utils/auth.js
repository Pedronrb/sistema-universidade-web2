import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Hash da senha
export const hashPassword = async (password) => {
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

// Comparar senha
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Gerar token JWT
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    papeis: user.papeis?.map(p => p.papel.nome) || []
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verificar token JWT
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
