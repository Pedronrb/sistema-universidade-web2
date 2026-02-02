import { Router } from "express";
import { userController } from "./userController.js";

const router = Router();

router.get("/", userController.listAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
