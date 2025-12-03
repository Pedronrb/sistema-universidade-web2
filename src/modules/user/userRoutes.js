import { Router } from "express";
import { userController } from "./userController.js";

const router = Router();

router.get("/", userController.listAll);
router.get("/:id", userController.getById);
router.post("/", userController.createUser);
router.post("/admin", userController.createAdminUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
