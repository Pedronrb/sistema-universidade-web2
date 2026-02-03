// src/modules/papel/papelService.js
import { papelRepository } from "./papelRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";

export const papelService = {
  async create({ nome }) {
    if (!nome) throw new HttpError(400, "O nome do papel é obrigatório.");

    const existing = await papelRepository.findByName(nome);
    if (existing) throw new HttpError(409, `O papel '${nome}' já existe.`);

    return await papelRepository.create({ nome });
  },

  async listAll() {
    return await papelRepository.findAll();
  },

  async getByName(nome) {
    const papel = await papelRepository.findByName(nome);
    if (!papel) {
      // AJUSTE: Lançar 404 impede que o UserService receba null e estoure erro 500
      throw new HttpError(404, `Papel '${nome}' não encontrado.`);
    }
    return papel;
  },

  async getById(id) {
    const papel = await papelRepository.findById(id);
    if (!papel) throw new HttpError(404, "Papel não encontrado.");
    return papel;
  },
  
  async deleteById(id) {
    await this.getById(id);
    await papelRepository.delete(id);
  },

  async updateById(id, { nome }) {
    await this.getById(id);
    await papelRepository.update(id, { nome });
  }
};