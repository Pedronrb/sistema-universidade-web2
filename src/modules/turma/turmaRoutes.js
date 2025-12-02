const express = require("express");
const router = express.Router();
const turmaController = require("../turma/turmaController");

router.post("/", turmaController.create);
router.get("/", turmaController.list);
router.get("/:id", turmaController.getById);
router.get("/professor/:professorId", turmaController.listByProfessor);
router.get("/disciplina/:disciplinaId", turmaController.listByDisciplina);
router.put("/:id", turmaController.update);
router.delete("/:id", turmaController.delete);

module.exports = router;
