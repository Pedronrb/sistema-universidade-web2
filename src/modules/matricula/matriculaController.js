import { matriculaService } from "../matricula/matriculaService.js";

class MatriculaController {
  async create(req, res) {
    try {
      const matricula = await matriculaService.createMatricula(req.body);
      return res.status(201).json(matricula);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculas();
      return res.status(200).json(matriculas);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res) {
    try {
      const matricula = await matriculaService.getMatriculaById(req.params.id);
      return res.status(200).json(matricula);
    } catch (error) {
      next(error);
    }
  }

  async listByUsuario(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculasByUsuario(
        req.params.usuarioId,
      );
      return res.status(200).json(matriculas);
    } catch (error) {
      next(error);
    }
  }

  async listByTurma(req, res) {
    try {
      const matriculas = await matriculaService.listMatriculasByTurma(
        req.params.turmaId,
      );
      return res.status(200).json(matriculas);
    } catch (error) {
      next(error);
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
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await matriculaService.deleteMatricula(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const matriculaController = new MatriculaController();
