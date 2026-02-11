import { frequenciaRepository } from "../frequencia/frequenciaRepository.js";
import { matriculaRepository } from "../matricula/matriculaRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";

class FrequenciaService {
  async createFrequencia(data) {
    const { matriculaId, data: dataAula, presente } = data;

    if (!matriculaId || !dataAula || presente === undefined) {
      throw new HttpError(400, "Todos os campos são obrigatórios");
    }

    const matriculaExiste = await matriculaRepository.getById(matriculaId);
    if (!matriculaExiste) {
      throw new HttpError(404, "Matrícula não encontrada");
    }

    const frequenciaExiste = await frequenciaRepository.getByMatriculaAndData(
      matriculaId,
      dataAula,
    );

    if (frequenciaExiste) {
      throw new HttpError(
        409,
        "Já existe registro de frequência para esta data",
      );
    }

    return await frequenciaRepository.create({
      matriculaId: parseInt(matriculaId),
      data: new Date(dataAula),
      presente: Boolean(presente),
    });
  }

  async createFrequenciaLote(data) {
    const { turmaId, data: dataAula, presencas } = data;

    if (!turmaId || !dataAula || !presencas || !Array.isArray(presencas)) {
      throw new HttpError(400, "Dados inválidos para registro em lote");
    }

    const frequenciasCriadas = [];
    const erros = [];

    for (const presenca of presencas) {
      try {
        const frequencia = await this.createFrequencia({
          matriculaId: presenca.matriculaId,
          data: dataAula,
          presente: presenca.presente,
        });
        frequenciasCriadas.push(frequencia);
      } catch (error) {
        erros.push({
          matriculaId: presenca.matriculaId,
          erro: error.message,
        });
      }
    }

    return {
      sucesso: frequenciasCriadas,
      erros,
    };
  }

  async listFrequencias() {
    return await frequenciaRepository.getAll();
  }

  async getFrequenciaById(id) {
    const frequencia = await frequenciaRepository.getById(id);

    if (!frequencia) {
      throw new HttpError(404, "Frequência não encontrada");
    }

    return frequencia;
  }

  async listFrequenciasByMatricula(matriculaId) {
    return await frequenciaRepository.getByMatricula(matriculaId);
  }

  async listFrequenciasByTurmaAndData(turmaId, data) {
    if (!data) {
      throw new HttpError(400, "Data é obrigatória");
    }

    return await frequenciaRepository.getByTurmaAndData(turmaId, data);
  }

  async updateFrequencia(id, data) {
    const frequenciaExiste = await frequenciaRepository.getById(id);

    if (!frequenciaExiste) {
      throw new HttpError(404, "Frequência não encontrada");
    }

    if (data.matriculaId) {
      data.matriculaId = parseInt(data.matriculaId);
    }

    if (data.data) {
      data.data = new Date(data.data);
    }

    if (data.presente !== undefined) {
      data.presente = Boolean(data.presente);
    }

    return await frequenciaRepository.update(id, data);
  }

  async deleteFrequencia(id) {
    const frequenciaExiste = await frequenciaRepository.getById(id);

    if (!frequenciaExiste) {
      throw new HttpError(404, "Frequência não encontrada");
    }

    return await frequenciaRepository.delete(id);
  }
}

export const frequenciaService = new FrequenciaService();
