import { frequenciaService } from "../frequencia/frequenciaService.js";

class FrequenciaController {
  async create(req, res, next) {
    try {
      const frequencia = await frequenciaService.createFrequencia(req.body);
      return res.status(201).json(frequencia);
    } catch (error) {
      next(error);
    }
  }

  async createLote(req, res, next) {
    try {
      const resultado = await frequenciaService.createFrequenciaLote(req.body);
      return res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const frequencias = await frequenciaService.listFrequencias();
      return res.status(200).json(frequencias);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const frequencia = await frequenciaService.getFrequenciaById(
        req.params.id,
      );
      return res.status(200).json(frequencia);
    } catch (error) {
      next(error);
    }
  }

  async listByMatricula(req, res, next) {
    try {
      const frequencias = await frequenciaService.listFrequenciasByMatricula(
        req.params.matriculaId,
      );
      return res.status(200).json(frequencias);
    } catch (error) {
      next(error);
    }
  }

  async listByTurmaAndData(req, res, next) {
    try {
      const { turmaId } = req.params;
      const { data } = req.query;

      const frequencias = await frequenciaService.listFrequenciasByTurmaAndData(
        turmaId,
        data,
      );
      return res.status(200).json(frequencias);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const frequencia = await frequenciaService.updateFrequencia(
        req.params.id,
        req.body,
      );
      return res.status(200).json(frequencia);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await frequenciaService.deleteFrequencia(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const frequenciaController = new FrequenciaController();
