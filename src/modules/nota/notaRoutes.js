import express from "express";
import { notaController } from "../nota/notaController.js";

const router = express.Router();

router.post("/", notaController.create);
router.get("/", notaController.list);
router.get("/:id", notaController.getById);
router.get("/matricula/:matriculaId", notaController.listByMatricula);
router.put("/:id", notaController.update);
router.delete("/:id", notaController.delete);

export default router;
