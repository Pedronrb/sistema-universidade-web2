import { matriculaService } from "../matricula/matriculaService.js";

class MatriculaController {
  async create(req, res) {
    try {
      const matricula = await matriculaService.createMatricula(req.body);
      return res.status(201).json(matricula);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async list(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculas();
      return res.status(200).json(matriculas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async getById(req, res) {
    try {
      const matricula = await matriculaService.getMatriculaById(req.params.id);
      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async listByUsuario(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculasByUsuario(
        req.params.usuarioId,
      );
      return res.status(200).json(matriculas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async listByTurma(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculasByTurma(
        req.params.turmaId,
      );
      return res.status(200).json(matriculas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async update(req, res) {
    try {
      const matricula = await matriculaService.updateMatricula(
        req.params.id,
        req.body,
      );
      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      await matriculaService.deleteMatricula(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export const matriculaController = new MatriculaController();
