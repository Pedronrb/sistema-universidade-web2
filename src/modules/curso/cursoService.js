import { cursoRepository } from "./cursoRepository.js";

class CursoService {
  async createCurso(data) {
    const { nome, descricao } = data;

    if (!nome) {
      throw new Error("Nome do curso é obrigatório");
    }

    return await cursoRepository.create({ nome, descricao });
  }

  async listCursos() {
    return await cursoRepository.getAll();
  }

  async getCursoById(id) {
    const curso = await cursoRepository.getById(id);

    if (!curso) {
      throw new Error("Curso não encontrado");
    }

    return curso;
  }

  async updateCurso(id, data) {
    const cursoExiste = await cursoRepository.getById(id);

    if (!cursoExiste) {
      throw new Error("Curso não encontrado");
    }

    return await cursoRepository.update(id, data);
  }

  async deleteCurso(id) {
    const cursoExiste = await cursoRepository.getById(id);

    if (!cursoExiste) {
      throw new Error("Curso não encontrado");
    }

    return await cursoRepository.delete(id);
  }
}

export const cursoService = new CursoService();
