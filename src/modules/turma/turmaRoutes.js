import express from "express";
import { turmaController } from "./turmaController.js";

const router = express.Router();

router.post("/", turmaController.create);
router.get("/", turmaController.list);
router.get("/:id", turmaController.getById);
router.get("/professor/:professorId", turmaController.listByProfessor);
router.get("/disciplina/:disciplinaId", turmaController.listByDisciplina);
router.put("/:id", turmaController.update);
router.delete("/:id", turmaController.delete);

export default router;
