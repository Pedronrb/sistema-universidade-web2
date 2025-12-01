import bcrypt from "bcryptjs";
import { userRepository } from "../user/userRepository.js";
import { HttpError } from "../../middlewares/HttpError.js";

const SALT_ROUNDS = 10;

export const userService = {
  async listAll() {
    return await userRepository.findAll();
  },

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new HttpError(404, "Usuário não encontrado");
    }
    return user;
  },

  async createUser({ nome, email, senha }) {
    // validações simples
    if (!nome || !email || !senha) {
      throw new HttpError(400, "nome, email e senha são obrigatórios");
    }

    // checar se email já existe
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new HttpError(409, "Email já cadastrado");
    }

    // gerar hash
    const hashed = await bcrypt.hash(senha, SALT_ROUNDS);

    const created = await userRepository.create({
      nome,
      email,
      senha: hashed,
    });

    // não retornar a senha
    const { senha: _, ...rest } = created;
    return rest;
  }
};
