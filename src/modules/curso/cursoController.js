import { cursoService } from "../curso/cursoService.js";

class CursoController {
  async create(req, res, next) {
    try {
      const curso = await cursoService.createCurso(req.body);
      return res.status(201).json(curso);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const cursos = await cursoService.listCursos();
      return res.status(200).json(cursos);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const curso = await cursoService.getCursoById(req.params.id);
      return res.status(200).json(curso);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const curso = await cursoService.updateCurso(req.params.id, req.body);
      return res.status(200).json(curso);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await cursoService.deleteCurso(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const cursoController = new CursoController();
