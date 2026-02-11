import express from "express";
import { frequenciaController } from "../frequencia/frequenciaController.js";

const router = express.Router();

router.post("/", frequenciaController.create);
router.post("/lote", frequenciaController.createLote);
router.get("/", frequenciaController.list);
router.get("/:id", frequenciaController.getById);
router.get("/matricula/:matriculaId", frequenciaController.listByMatricula);
router.get("/turma/:turmaId", frequenciaController.listByTurmaAndData);
router.put("/:id", frequenciaController.update);
router.delete("/:id", frequenciaController.delete);

export default router;
