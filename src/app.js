import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa rotas
import userRoutes from "./modules/user/userRoutes.js";

// Importa middleware de erro
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Healthcheck route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API do Sistema está rodando!" });
});

// Registro das rotas
app.use("/users", userRoutes);

// Middleware de erro (depois das rotas!!!!!)
app.use(errorMiddleware);

// Middleware final: rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

export default app;
