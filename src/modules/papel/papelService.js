import { papelRepository } from "./papelRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";

export const papelService = {
  async create({ nome }) {
    if (!nome) {
      throw new HttpError(400, "O nome do papel é obrigatório.");
    }

    const existing = await papelRepository.findByName(nome);
    if (existing) {
      throw new HttpError(409, `O papel '${nome}' já existe.`);
    }

    return await papelRepository.create({ nome });
  },

  async listAll() {
    return await papelRepository.findAll();
  },

  async getByName(nome) {
    const papel = await papelRepository.findByName(nome);
    if (!papel) {
        throw new HttpError(404, `Papel '${nome}' não encontrado.`);
    }
    return papel;
  },

  async getById(id) {
    const papel = await papelRepository.findById(id);
    if (!papel) {
        throw new HttpError(404, "Papel não encontrado.");
    }
    return papel;
  },
  // Adicionar update e delete futuramente.
};