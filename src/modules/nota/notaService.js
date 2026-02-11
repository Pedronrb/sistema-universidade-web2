import { notaRepository } from "../nota/notaRepository.js";
import { matriculaRepository } from "../matricula/matriculaRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";

class NotaService {
  async createNota(data) {
    const { matriculaId, valor, etapa } = data;

    if (!matriculaId || valor === undefined || !etapa) {
      throw new HttpError(400, "Todos os campos são obrigatórios");
    }

    const notaValor = parseFloat(valor);
    if (isNaN(notaValor) || notaValor < 0 || notaValor > 10) {
      throw new HttpError(400, "A nota deve estar entre 0 e 10");
    }

    const matriculaExiste = await matriculaRepository.getById(matriculaId);
    if (!matriculaExiste) {
      throw new HttpError(404, "Matrícula não encontrada");
    }

    const notaExiste = await notaRepository.getByMatriculaAndEtapa(
      matriculaId,
      etapa,
    );

    if (notaExiste) {
      throw new HttpError(409, "Já existe uma nota cadastrada para esta etapa");
    }

    return await notaRepository.create({
      matriculaId: parseInt(matriculaId),
      valor: notaValor,
      etapa,
    });
  }

  async listNotas() {
    return await notaRepository.getAll();
  }

  async getNotaById(id) {
    const nota = await notaRepository.getById(id);

    if (!nota) {
      throw new HttpError(404, "Nota não encontrada");
    }

    return nota;
  }

  async listNotasByMatricula(matriculaId) {
    return await notaRepository.getByMatricula(matriculaId);
  }

  async updateNota(id, data) {
    const notaExiste = await notaRepository.getById(id);

    if (!notaExiste) {
      throw new HttpError(404, "Nota não encontrada");
    }

    if (data.valor !== undefined) {
      const notaValor = parseFloat(data.valor);
      if (isNaN(notaValor) || notaValor < 0 || notaValor > 10) {
        throw new HttpError(400, "A nota deve estar entre 0 e 10");
      }
      data.valor = notaValor;
    }

    if (data.matriculaId) {
      data.matriculaId = parseInt(data.matriculaId);
    }

    return await notaRepository.update(id, data);
  }

  async deleteNota(id) {
    const notaExiste = await notaRepository.getById(id);

    if (!notaExiste) {
      throw new HttpError(404, "Nota não encontrada");
    }

    return await notaRepository.delete(id);
  }
}

export const notaService = new NotaService();
