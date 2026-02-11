import { notaService } from "../nota/notaService.js";

class NotaController {
  async create(req, res, next) {
    try {
      const nota = await notaService.createNota(req.body);
      return res.status(201).json(nota);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const notas = await notaService.listNotas();
      return res.status(200).json(notas);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const nota = await notaService.getNotaById(req.params.id);
      return res.status(200).json(nota);
    } catch (error) {
      next(error);
    }
  }

  async listByMatricula(req, res, next) {
    try {
      const notas = await notaService.listNotasByMatricula(
        req.params.matriculaId,
      );
      return res.status(200).json(notas);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const nota = await notaService.updateNota(req.params.id, req.body);
      return res.status(200).json(nota);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await notaService.deleteNota(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const notaController = new NotaController();
