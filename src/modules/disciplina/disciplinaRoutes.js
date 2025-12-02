const express = require("express");
const router = express.Router();
const disciplinaController = require("../disciplina/disciplinaController");

router.post("/", disciplinaController.create);
router.get("/", disciplinaController.list);
router.get("/:id", disciplinaController.getById);
router.get("/curso/:cursoId", disciplinaController.listByCurso);
router.put("/:id", disciplinaController.update);
router.delete("/:id", disciplinaController.delete);

module.exports = router;
