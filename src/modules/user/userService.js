import bcrypt from "bcryptjs";
import { userRepository } from "./userRepository.js";
import { papelService } from "../papel/papelService.js";
import { HttpError } from "../../middlewares/HttpError.js";

const SALT_ROUNDS = 10;
const PAPEL_PADRAO = "aluno";

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
      papeis: user.papeis?.map(up => ({ ...up.papel })) || []
    };
  },

  async create(dto) {
    dto.validate();
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new HttpError(409, "Email já cadastrado");

    const papelNome = (dto.papelNome || PAPEL_PADRAO).toLowerCase();
    const papel = await papelService.getByName(papelNome);
    
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
    const user = await this.getById(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing && existing.id !== Number(id)) {
        throw new HttpError(409, "Email já cadastrado por outro usuário");
      }
    }

    // Construção dinâmica para evitar erro 500 no bcrypt
    const data = {};
    if (dto.nome) data.nome = dto.nome;
    if (dto.email) data.email = dto.email.toLowerCase();
    
    // Só hashea se a senha for enviada e não for vazia
    if (dto.senha && dto.senha.trim() !== "") {
      data.senha = await bcrypt.hash(dto.senha, SALT_ROUNDS);
    }

    // Se nada foi enviado para mudar, retorna o usuário atual
    if (Object.keys(data).length === 0) return user;

    return userRepository.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    
    // Validação de integridade acadêmica
    if (await userRepository.hasTurmas(id))
      throw new HttpError(409, "Usuário não pode ser excluído: possui turmas associadas");
    if (await userRepository.hasMatriculas(id))
      throw new HttpError(409, "Usuário não pode ser excluído: possui matrículas associadas");

    await userRepository.delete(id);
  }
};