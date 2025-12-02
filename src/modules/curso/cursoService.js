const cursoRepository = require("../curso/cursoRepository");

class CursoService {
  async createCurso(data) {
    const { nome, descricao } = data;

    if (!nome) {
      throw new Error("Nome do curso é obrigatório");
    }

    return await cursoRepository.create({ nome, descricao });
  }

  async findAll() {
    return await cursoRepository.findAll();
  }

  async getById(id) {
    const curso = await cursoRepository.findById(id);

    if (!curso) {
      throw new Error("Curso não encontrado");
    }

    return curso;
  }

  async updateCurso(id, data) {
    const cursoExiste = await cursoRepository.findById(id);

    if (!cursoExiste) {
      throw new Error("Curso não encontrado");
    }

    return await cursoRepository.update(id, data);
  }

  async deleteCurso(id) {
    const cursoExiste = await cursoRepository.findById(id);

    if (!cursoExiste) {
      throw new Error("Curso não encontrado");
    }

    return await cursoRepository.delete(id);
  }
}

module.exports = new CursoService();
