import express from "express";
const router = express.Router();
import { turmaController } from "../turma/turmaController.js";

router.post("/", turmaController.create);
router.get("/", turmaController.list);
router.get("/:id", turmaController.getById);
router.get("/professor/:professorId", turmaController.listByProfessor);
router.get("/disciplina/:disciplinaId", turmaController.listByDisciplina);
router.put("/:id", turmaController.update);
router.delete("/:id", turmaController.delete);

export default router;
