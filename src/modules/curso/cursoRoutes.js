import express from "express";
import { cursoController } from "./cursoController.js";

const router = express.Router();

router.post("/", cursoController.create);
router.get("/", cursoController.list);
router.get("/:id", cursoController.getById);
router.put("/:id", cursoController.update);
router.delete("/:id", cursoController.delete);

export default router;
