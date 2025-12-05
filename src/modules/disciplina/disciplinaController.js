import { disciplinaService } from "./disciplinaService.js";

class DisciplinaController {
  async create(req, res) {
    try {
      const disciplina = await disciplinaService.createDisciplina(req.body);
      return res.status(201).json(disciplina);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async list(req, res) {
    try {
      const disciplinas = await disciplinaService.listDisciplinas();
      return res.status(200).json(disciplinas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async getById(req, res) {
    try {
      const disciplina = await disciplinaService.getDisciplinaById(
        req.params.id,
      );
      return res.status(200).json(disciplina);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async listByCurso(req, res) {
    try {
      const disciplinas = await disciplinaService.listDisciplinasByCurso(
        req.params.cursoId,
      );
      return res.status(200).json(disciplinas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const disciplina = await disciplinaService.updateDisciplina(
        req.params.id,
        req.body,
      );
      return res.status(200).json(disciplina);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await disciplinaService.deleteDisciplina(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export const disciplinaController = new DisciplinaController();
