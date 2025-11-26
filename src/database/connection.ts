import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || "admin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "universidade",
  password: process.env.DB_PASSWORD || "admin",
  port: Number(process.env.DB_PORT || 5432),
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Conexão com o banco realizada com sucesso!");
    client.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
};