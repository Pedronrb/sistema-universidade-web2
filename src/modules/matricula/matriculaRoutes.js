import express from "express";
import { matriculaController } from "../matricula/matriculaController.js";

const router = express.Router();

router.post("/", matriculaController.create);
router.get("/", matriculaController.list);
router.get("/:id", matriculaController.getById);
router.get("/usuario/:usuarioId", matriculaController.listByUsuario);
router.get("/turma/:turmaId", matriculaController.listByTurma);
router.put("/:id", matriculaController.update);
router.delete("/:id", matriculaController.delete);

export default router;
