import { userService } from "./userService.js";

export const userController = {
  // GET /usuarios
  async listAll(req, res, next) {
    try {
      const users = await userService.listAll();
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  // GET /usuarios/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const user = await userService.getById(id);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  // POST /usuarios
  async createUser(req, res, next) {
    try {
      const { nome, email, senha } = req.body;

      // validação mínima
      if (!nome || !email || !senha) {
        return res.status(400).json({
          message: "Campos nome, email e senha são obrigatórios"
        });
      }

      const created = await userService.createUser({ nome, email, senha });
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },
};
