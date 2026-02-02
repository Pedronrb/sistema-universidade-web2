import { papelService } from "./papelService.js";

export const papelController = {
  // POST /api/papeis
  async create(req, res, next) {
    try {
      const { nome } = req.body;
      const created = await papelService.create({ nome });
      return res.status(201).json(created); 
    } catch (err) {
      next(err);
    }
  },

  // GET /api/papeis
  async listAll(req, res, next) {
    try {
      const papeis = await papelService.listAll();
      return res.status(200).json(papeis);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/papeis/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (Number.isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido. Deve ser um número." });
      }
      
      const papel = await papelService.getById(id);
      return res.status(200).json(papel);
    } catch (err) {
      next(err);
    }
  },

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await papelService.deleteById(id);
      return res.status(200).json(deleted);
    } catch (err) {
      next(err);
    }
  },
  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      const updated = await papelService.updateById(id, { nome });
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },
};