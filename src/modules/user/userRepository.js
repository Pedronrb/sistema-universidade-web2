import { prisma } from "../../prisma.js";

export const userRepository = {
  // Listar todos os usuários
  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Buscar usuário pelo ID
  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Buscar usuário pelo email (inclui senha para autenticação)
  async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true, // necessário para login (hash)
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Buscar usuário pelo ID incluindo roles
  async findByIdWithRoles(id) {
    return prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        papeis: {
          select: {
            papel: {
              select: { nome: true },
            },
          },
        },
      },
    });
  },

  // Criar usuário
  async create(data) {
    return prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Atualizar usuário
  async update(id, data) {
    return prisma.usuario.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Deletar usuário
  async delete(id) {
    return prisma.usuario.delete({
      where: { id: Number(id) },
    });
  },
};
