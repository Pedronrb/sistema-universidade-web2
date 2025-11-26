import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const service = new UserService();

export class UserController {

  async create(req: Request, res: Response) {
    try {
      const user = await service.create(req.body);
      return res.status(201).json(user);
    } catch (e) {
      return res.status(400).json({ error: "Erro ao criar usuário." });
    }
  }

  async list(req: Request, res: Response) {
    const users = await service.list();
    return res.json(users);
  }

  async find(req: Request, res: Response) {
    const user = await service.find(Number(req.params.id));
    return user ? res.json(user) : res.status(404).json({ error: "Usuário não encontrado" });
  }

  async update(req: Request, res: Response) {
    const user = await service.update(Number(req.params.id), req.body);
    return user ? res.json(user) : res.status(404).json({ error: "Usuário não encontrado" });
  }

  async delete(req: Request, res: Response) {
    const ok = await service.delete(Number(req.params.id));
    return ok ? res.sendStatus(204) : res.status(404).json({ error: "Usuário não encontrado" });
  }
}
