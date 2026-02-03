import { Router } from "express";
import { userController } from "./userController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Listar usuários (admin e coordenador)
router.get("/", authenticate, authorize(["admin", "coordenador"]), userController.listAll);
router.get("/:id", authenticate, authorize(["admin", "coordenador"]), userController.getById);

// Criar, atualizar e deletar usuários (apenas admin)
router.post("/", authenticate, authorize(["admin"]), userController.create);
router.put("/:id", authenticate, authorize(["admin"]), userController.update);
router.delete("/:id", authenticate, authorize(["admin"]), userController.delete);

export default router;
