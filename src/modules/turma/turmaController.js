const turmaService = require("../turma/turmaService");

class TurmaController {
  async create(req, res) {
    try {
      const turma = await turmaService.createTurma(req.body);
      return res.status(201).json(turma);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async list(req, res) {
    try {
      const turmas = await turmaService.listTurmas();
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async getById(req, res) {
    try {
      const turma = await turmaService.getTurmaById(req.params.id);
      return res.status(200).json(turma);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async listByProfessor(req, res) {
    try {
      const turmas = await turmaService.listTurmasByProfessor(
        req.params.professorId,
      );
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async listByDisciplina(req, res) {
    try {
      const turmas = await turmaService.listTurmasByDisciplina(
        req.params.disciplinaId,
      );
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const turma = await turmaService.updateTurma(req.params.id, req.body);
      return res.status(200).json(turma);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await turmaService.deleteTurma(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new TurmaController();
