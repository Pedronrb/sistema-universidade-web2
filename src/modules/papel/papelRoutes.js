import { Router } from "express";
import { papelController } from "./papelController.js";

const router = Router();

// Endpoint para criar um novo papel
router.post("/papeis", papelController.create);

router.get("/papeis", papelController.listAll);

router.get("/papeis/:id", papelController.getById);

export default router;