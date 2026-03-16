import { turmaService } from "../turma/turmaService.js";

class TurmaController {
  async create(req, res, next) {
    try {
      const turma = await turmaService.createTurma(req.body);
      return res.status(201).json(turma);
    } catch (error) {
      next(error);
    }
  }
  async list(req, res, next) {
    try {
      const turmas = await turmaService.listTurmas();
      return res.status(200).json(turmas);
    } catch (error) {
      next(error);
    }
  }
  async getById(req, res, next) {
    try {
      const turma = await turmaService.getTurmaById(req.params.id);
      return res.status(200).json(turma);
    } catch (error) {
      next(error);
    }
  }
  async listByProfessor(req, res, next) {
    try {
      const turmas = await turmaService.listTurmasByProfessor(
        req.params.professorId,
      );
      return res.status(200).json(turmas);
    } catch (error) {
      next(error);
    }
  }
  async listByDisciplina(req, res, next) {
    try {
      const turmas = await turmaService.listTurmasByDisciplina(
        req.params.disciplinaId,
      );
      return res.status(200).json(turmas);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const turma = await turmaService.updateTurma(req.params.id, req.body);
      return res.status(200).json(turma);
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      await turmaService.deleteTurma(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const turmaController = new TurmaController();
