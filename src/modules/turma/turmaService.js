const turmaRepository = require("../turma/turmaRepository");

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
    return await turmaRepository.findAll();
  }

  async getById(id) {
    const turma = await turmaRepository.findById(id);

    if (!turma) {
      throw new Error("Turma não encontrada");
    }

    return turma;
  }

  async listTurmasByProfessor(professorId) {
    return await turmaRepository.findByProfessor(professorId);
  }

  async listTurmasByDisciplina(disciplinaId) {
    return await turmaRepository.findByDisciplina(disciplinaId);
  }

  async updateTurma(id, data) {
    const turmaExiste = await turmaRepository.findById(id);

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
    const turmaExiste = await turmaRepository.findById(id);

    if (!turmaExiste) {
      throw new Error("Turma não encontrada");
    }

    return await turmaRepository.delete(id);
  }
}

module.exports = new TurmaService();
