import { prisma } from "../../Prisma.js";


export const userRepository = {
  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },

  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },

  async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,     // necessário para login (hash)
        createdAt: true,
        updatedAt: true,
      }
    });
  },

  async create(data) {
    return prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },
};
