import { disciplinaRepository } from "./disciplinaRepository.js";

class DisciplinaService {
  async createDisciplina(data) {
    const { nome, codigo, cargaHoraria, cursoId } = data;

    if (!nome || !codigo || !cargaHoraria || !cursoId) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const disciplinaExiste = await disciplinaRepository.getByCodigo(codigo);

    if (disciplinaExiste) {
      throw new Error("Já existe uma disciplina com este código");
    }

    return await disciplinaRepository.create({
      nome,
      codigo,
      cargaHoraria: parseInt(cargaHoraria),
      cursoId: parseInt(cursoId),
    });
  }

  async listDisciplinas() {
    return await disciplinaRepository.getAll();
  }

  async getDisciplinaById(id) {
    const disciplina = await disciplinaRepository.getById(id);

    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }

    return disciplina;
  }

  async listDisciplinasByCurso(cursoId) {
    return await disciplinaRepository.getByCurso(cursoId);
  }

  async updateDisciplina(id, data) {
    const disciplinaExiste = await disciplinaRepository.getById(id);

    if (!disciplinaExiste) {
      throw new Error("Disciplina não encontrada");
    }

    if (data.codigo && data.codigo !== disciplinaExiste.codigo) {
      const codigoEmUso = await disciplinaRepository.getByCodigo(data.codigo);
      if (codigoEmUso) {
        throw new Error("Já existe uma disciplina com este código");
      }
    }

    if (data.cargaHoraria) {
      data.cargaHoraria = parseInt(data.cargaHoraria);
    }

    if (data.cursoId) {
      data.cursoId = parseInt(data.cursoId);
    }

    return await disciplinaRepository.update(id, data);
  }

  async deleteDisciplina(id) {
    const disciplinaExiste = await disciplinaRepository.getById(id);

    if (!disciplinaExiste) {
      throw new Error("Disciplina não encontrada");
    }

    return await disciplinaRepository.delete(id);
  }
}

export const disciplinaService = new DisciplinaService();
