import express from "express";
import { disciplinaController } from "./disciplinaController.js";

const router = express.Router();

router.post("/", disciplinaController.create);
router.get("/", disciplinaController.list);
router.get("/:id", disciplinaController.getById);
router.get("/curso/:cursoId", disciplinaController.getByCurso);
router.put("/:id", disciplinaController.update);
router.delete("/:id", disciplinaController.delete);

export default router;
