const express = require("express");
const router = express.Router();
const cursoController = require("../curso/cursoController");

router.post("/", cursoController.create);
router.get("/", cursoController.list);
router.get("/:id", cursoController.getById);
router.put("/:id", cursoController.update);
router.delete("/:id", cursoController.delete);

module.exports = router;
