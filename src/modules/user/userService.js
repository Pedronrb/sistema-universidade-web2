import bcrypt from "bcryptjs";
import { userRepository } from "./userRepository.js";
import { papelService } from "../papel/papelService.js";
import { HttpError } from "../../middlewares/HttpError.js";

const SALT_ROUNDS = 10;
const PAPEL_PADRAO = "Aluno";

export const userService = {
  async listAll() {
    return userRepository.findAll();
  },

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  },

  async create(dto) {
    dto.validate();

    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new HttpError(409, "Email já cadastrado");

    const papelNome = dto.papelNome || PAPEL_PADRAO;
    const papel = await papelService.getByName(papelNome);
    if (!papel) throw new HttpError(404, `Papel '${papelNome}' não encontrado`);

    const senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);

    return userRepository.createWithRole({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      papelId: papel.id
    });
  },

  async update(id, dto) {
    dto.validate();
    await this.getById(id); // Reutiliza a lógica de "não encontrado"

    if (dto.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new HttpError(409, "Email já cadastrado por outro usuário");
      }
    }

    const data = {
      ...(dto.nome && { nome: dto.nome }),
      ...(dto.email && { email: dto.email }),
      ...(dto.senha && { senha: await bcrypt.hash(dto.senha, SALT_ROUNDS) })
    };

    return userRepository.update(id, data);
  },

  async delete(id) {
    await this.getById(id);

    const possuiTurmas = await userRepository.hasTurmas(id);
    if (possuiTurmas) {
      throw new HttpError(
        409,
        "Usuário não pode ser excluído: possui turmas associadas"
      );
    }

    const possuiMatriculas = await userRepository.hasMatriculas(id);
    if (possuiMatriculas) {
      throw new HttpError(
        409,
        "Usuário não pode ser excluído: possui matrículas associadas"
      );
    }

    await userRepository.delete(id);
  }

};