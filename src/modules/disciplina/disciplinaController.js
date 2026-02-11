import { disciplinaService } from "./disciplinaService.js";

export class DisciplinaController {
  async create(req, res) {
    try {
      const disciplina = await disciplinaService.createDisciplina(req.body);
      return res.status(201).json(disciplina);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res) {
    try {
      const disciplinas = await disciplinaService.listDisciplinas();
      return res.status(200).json(disciplinas);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res) {
    try {
      const disciplina = await disciplinaService.getDisciplinaById(
        req.params.id,
      );
      return res.status(200).json(disciplina);
    } catch (error) {
      next(error);
    }
  }

  async getByCurso(req, res) {
    try {
      const disciplinas = await disciplinaService.getDisciplinasByCurso(
        req.params.cursoId,
      );
      return res.status(200).json(disciplinas);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const disciplina = await disciplinaService.updateDisciplinas(
        req.params.id,
        req.body,
      );
      return res.status(200).json(disciplina);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      await disciplinaService.deleteDisciplina(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const disciplinaController = new DisciplinaController();
