import bcrypt from "bcryptjs";
import { userRepository } from "./userRepository.js";
import { papelService } from "../papel/papelService.js";
import { HttpError } from "../../middlewares/HttpError.js";

const SALT_ROUNDS = 10;

export const userService = {
  async listAll() {
    return userRepository.findAll();
  },

  async getById(id) {
    const user = await userRepository.findById(Number(id));
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  },

  async getByIdWithRoles(id) {
    const user = await userRepository.findById(Number(id));
    if (!user) throw new HttpError(404, "Usuário não encontrado");

    return {
      ...user,
      papeis: user.papeis?.map((up) => ({ ...up.papel })) || [],
    };
  },

  async create(dto) {
    dto.validate();

    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new HttpError(409, "Email já cadastrado");

    // AGORA O PAPEL É OBRIGATÓRIO
    if (!dto.papelNome || dto.papelNome.trim() === "") {
      throw new HttpError(400, "papelNome é obrigatório");
    }

    const papelNome = dto.papelNome.toLowerCase();
    const papel = await papelService.getByName(papelNome);

    if (!papel) {
      throw new HttpError(404, `Papel '${papelNome}' não encontrado`);
    }

    const senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);

    return userRepository.createWithRole({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      papelId: papel.id,
    });
  },

  async update(id, dto) {
    dto.validate();
    const user = await this.getById(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing && existing.id !== Number(id)) {
        throw new HttpError(409, "Email já cadastrado por outro usuário");
      }
    }

    const data = {};

    if (dto.nome) data.nome = dto.nome;
    if (dto.email) data.email = dto.email.toLowerCase();

    if (dto.senha && dto.senha.trim() !== "") {
      data.senha = await bcrypt.hash(dto.senha, SALT_ROUNDS);
    }

    if (Object.keys(data).length === 0) return user;

    return userRepository.update(id, data);
  },

  async updatePapel(id, papelNome) {
    await this.getById(id);
    const papel = await papelService.getByName(papelNome);
    if (!papel) throw new HttpError(404, `Papel '${papelNome}' não encontrado`);
    return userRepository.updatePapel(id, papel.id);
  },

  async delete(id) {
    await this.getById(id);

    if (await userRepository.hasTurmas(id))
      throw new HttpError(
        409,
        "Usuário não pode ser excluído: possui turmas associadas",
      );

    if (await userRepository.hasMatriculas(id))
      throw new HttpError(
        409,
        "Usuário não pode ser excluído: possui matrículas associadas",
      );

    await userRepository.delete(id);
  },
};
