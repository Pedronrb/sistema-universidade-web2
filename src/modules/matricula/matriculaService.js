import { matriculaRepository } from "../matricula/matriculaRepository.js";

class MatriculaService {
  async createMatricula(data) {
    const { usuarioId, turmaId } = data;

    if (!usuarioId || !turmaId) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const matriculaExiste = await matriculaRepository.getByUsuarioAndTurma(
      usuarioId,
      turmaId,
    );

    if (matriculaExiste) {
      throw new Error("Usuário já está matriculado nesta turma");
    }

    return await matriculaRepository.create({
      usuarioId: parseInt(usuarioId),
      turmaId: parseInt(turmaId),
    });
  }

  async listMatriculas() {
    return await matriculaRepository.getAll();
  }

  async getMatriculaById(id) {
    const matricula = await matriculaRepository.getById(id);

    if (!matricula) {
      throw new Error("Matrícula não encontrada");
    }

    return matricula;
  }

  async listMatriculasByUsuario(usuarioId) {
    return await matriculaRepository.getByUsuario(usuarioId);
  }

  async listMatriculasByTurma(turmaId) {
    return await matriculaRepository.getByTurma(turmaId);
  }

  async updateMatricula(id, data) {
    const matriculaExiste = await matriculaRepository.getById(id);

    if (!matriculaExiste) {
      throw new Error("Matrícula não encontrada");
    }

    if (data.usuarioId) {
      data.usuarioId = parseInt(data.usuarioId);
    }

    if (data.turmaId) {
      data.turmaId = parseInt(data.turmaId);
    }

    return await matriculaRepository.update(id, data);
  }

  async deleteMatricula(id) {
    const matriculaExiste = await matriculaRepository.getById(id);

    if (!matriculaExiste) {
      throw new Error("Matrícula não encontrada");
    }

    return await matriculaRepository.delete(id);
  }
}

export const matriculaService = new MatriculaService();
