import bcrypt from "bcryptjs";
import { userRepository } from "./userRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";
import { papelService } from "../papel/papelService.js";

const SALT_ROUNDS = 10;
const PAPEL_PADRAO_REGISTRO = "Aluno"; // Papel padrão para rota pública

// Função interna para criar usuário com papel específico
async function createWithSpecificRole({ nome, email, senha, papelNome }) {
  if (!nome || !email || !senha) {
    throw new HttpError(400, "nome, email e senha são obrigatórios");
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new HttpError(409, "Email já cadastrado");
  }

  let papel;
  try {
    papel = await papelService.getByName(papelNome);
  } catch (error) { 
    if (error instanceof HttpError && error.status === 404) {
      const status = papelNome === PAPEL_PADRAO_REGISTRO ? 500 : 400;
      const message = papelNome === PAPEL_PADRAO_REGISTRO 
        ? `Erro interno: Papel padrão '${papelNome}' não configurado.`
        : `Papel '${papelNome}' não encontrado.`;
      throw new HttpError(status, message);
    }
    throw error;
  }

  const hashed = await bcrypt.hash(senha, SALT_ROUNDS);

  const created = await userRepository.create({
    nome,
    email,
    senha: hashed,
    papeis: { 
      create: { papelId: papel.id }
    }
  });

  const { senha: _, ...rest } = created;
  return rest;
}

export const userService = {
  async listAll() {
    return await userRepository.findAll();
  },

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  },

  // Criar usuário padrão (Aluno)
  async createUser({ nome, email, senha }) {
    return await createWithSpecificRole({ 
      nome, 
      email, 
      senha, 
      papelNome: PAPEL_PADRAO_REGISTRO
    });
  },

  // Criar usuário com papel específico
  async createAdminUser({ nome, email, senha, papelNome }) {
    return await createWithSpecificRole({ 
      nome, 
      email, 
      senha, 
      papelNome 
    });
  },

  // Atualizar usuário
  async updateUser(id, { nome, email, senha }) {
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, "Usuário não encontrado");

    const data = {};
    if (nome) data.nome = nome;
    if (email) {
      const existing = await userRepository.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new HttpError(409, "Email já cadastrado por outro usuário");
      }
      data.email = email;
    }
    if (senha) data.senha = await bcrypt.hash(senha, SALT_ROUNDS);

    const updated = await userRepository.update(id, data);
    const { senha: _, ...rest } = updated;
    return rest;
  },

  // Deletar usuário
  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, "Usuário não encontrado");

    await userRepository.delete(id);
    return { message: "Usuário removido com sucesso" };
  }
};

module.exports = { userService };