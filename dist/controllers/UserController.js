"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const service = new UserService_1.UserService();
class UserController {
    async create(req, res) {
        try {
            const user = await service.create(req.body);
            return res.status(201).json(user);
        }
        catch (e) {
            return res.status(400).json({ error: "Erro ao criar usuário." });
        }
    }
    async list(req, res) {
        const users = await service.list();
        return res.json(users);
    }
    async find(req, res) {
        const user = await service.find(Number(req.params.id));
        return user ? res.json(user) : res.status(404).json({ error: "Usuário não encontrado" });
    }
    async update(req, res) {
        const user = await service.update(Number(req.params.id), req.body);
        return user ? res.json(user) : res.status(404).json({ error: "Usuário não encontrado" });
    }
    async delete(req, res) {
        const ok = await service.delete(Number(req.params.id));
        return ok ? res.sendStatus(204) : res.status(404).json({ error: "Usuário não encontrado" });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map