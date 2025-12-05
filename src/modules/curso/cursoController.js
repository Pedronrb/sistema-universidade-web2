import { cursoService } from "./cursoService.js";

class CursoController {
  async create(req, res) {
    try {
      const curso = await cursoService.createCurso(req.body);
      return res.status(201).json(curso);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async list(req, res) {
    try {
      const cursos = await cursoService.listCursos();
      return res.status(200).json(cursos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async getById(req, res) {
    try {
      const curso = await cursoService.getCursoById(req.params.id);
      return res.status(200).json(curso);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const curso = await cursoService.updateCurso(req.params.id, req.body);
      return res.status(200).json(curso);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await cursoService.deleteCurso(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export const cursoController = new CursoController();
