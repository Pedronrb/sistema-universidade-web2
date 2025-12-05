import { turmaRepository } from "./turmaRepository.js";

class TurmaService {
  async createTurma(data) {
    const { codigo, disciplinaId, professorId, periodo } = data;

    if (!codigo || !disciplinaId || !professorId || !periodo) {
      throw new Error("Todos os campos são obrigatórios");
    }

    return await turmaRepository.create({
      codigo,
      disciplinaId: parseInt(disciplinaId),
      professorId: parseInt(professorId),
      periodo,
    });
  }

  async listTurmas() {
    return await turmaRepository.getAll();
  }

  async getTurmaById(id) {
    const turma = await turmaRepository.getById(id);

    if (!turma) {
      throw new Error("Turma não encontrada");
    }

    return turma;
  }

  async listTurmasByProfessor(professorId) {
    return await turmaRepository.getByProfessor(professorId);
  }

  async listTurmasByDisciplina(disciplinaId) {
    return await turmaRepository.getByDisciplina(disciplinaId);
  }

  async updateTurma(id, data) {
    const turmaExiste = await turmaRepository.getById(id);

    if (!turmaExiste) {
      throw new Error("Turma não encontrada");
    }

    if (data.disciplinaId) {
      data.disciplinaId = parseInt(data.disciplinaId);
    }

    if (data.professorId) {
      data.professorId = parseInt(data.professorId);
    }

    return await turmaRepository.update(id, data);
  }

  async deleteTurma(id) {
    const turmaExiste = await turmaRepository.getById(id);

    if (!turmaExiste) {
      throw new Error("Turma não encontrada");
    }

    return await turmaRepository.delete(id);
  }
}

export const turmaService = new TurmaService();
