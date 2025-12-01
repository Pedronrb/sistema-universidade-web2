import { Router } from "express";
import { userController } from "./userController.js";

const router = Router();

router.get("/", userController.listAll);
router.get("/:id", userController.getById);
router.post("/", userController.createUser);
export default router;
