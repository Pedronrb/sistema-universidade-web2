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

  // POST /usuarios/admin
  async createAdminUser(req, res, next) {
    try {
      const { nome, email, senha, papelNome } = req.body;
      if (!papelNome) {
        return res.status(400).json({
          message: "Campo papelNome é obrigatório para criar o usuário admin"
        });
      }

      const created = await userService.createAdminUser({ nome, email, senha, papelNome });
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  // PUT /usuarios/:id
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      const updated = await userService.updateUser(id, { nome, email, senha });
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /usuarios/:id
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      return res.status(200).json(deleted);
    } catch (err) {
      next(err);
    }
  }
};
