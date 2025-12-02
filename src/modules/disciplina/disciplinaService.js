const disciplinaRepository = require("../disciplina/disciplinaRepository");

class DisciplinaService {
  async createDisciplina(data) {
    const { nome, codigo, cargaHoraria, cursoId } = data;

    if (!nome || !codigo || !cargaHoraria || !cursoId) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const disciplinaExiste = await disciplinaRepository.findByCodigo(codigo);

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
    return await disciplinaRepository.findAll();
  }

  async getById(id) {
    const disciplina = await disciplinaRepository.findById(id);

    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }

    return disciplina;
  }

  async getDisciplinasByCurso(cursoId) {
    return await disciplinaRepository.findByCurso(cursoId);
  }

  async updateDisciplinas(id, data) {
    const disciplinaExiste = await disciplinaRepository.findById(id);

    if (!disciplinaExiste) {
      throw new Error("Disciplina não encontrada");
    }

    if (data.codigo && data.codigo !== disciplinaExiste.codigo) {
      const codigoEmUso = await disciplinaRepository.findByCodigo(data.codigo);
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
    const disciplinaExiste = await disciplinaRepository.findById(id);

    if (!disciplinaExiste) {
      throw new Error("Disciplina não encontrada");
    }

    return await disciplinaRepository.delete(id);
  }
}

module.exports = new DisciplinaService();
