import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa rotas
import userRoutes from "./modules/user/userRoutes.js";
import turmaRoutes from "./modules/turma/turmaRoutes.js";
import cursoRoutes from "./modules/curso/cursoRoutes.js";
import disciplinaRoutes from "./modules/disciplina/disciplinaRoutes.js";
import papelRoutes from "./modules/papel/papelRoutes.js";

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
app.use("/cursos", cursoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/turmas", turmaRoutes);
app.use("/papeis", papelRoutes);

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
