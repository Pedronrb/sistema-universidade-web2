"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const controller = new UserController_1.UserController();
router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.find);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map