import { prisma } from "../../prisma.js";

export const userRepository = {
  async findAll() {
    return prisma.usuario.findMany({
      include: {
        papeis: { select: { papel: { select: { nome: true } } } }
      }
    });
  },

  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        papeis: { select: { papel: { select: { nome: true } } } }
      }
    });
  },

  async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      include: { 
        papeis: { select: { papel: { select: { nome: true } } } } 
      }
    });
  },

  async findByUsername(username) {
    return this.findByEmail(username);
  },

  async createWithRole({ nome, email, senhaHash, papelId }) {
    return prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papeis: { create: { papelId } }
      },
      include: { papeis: { select: { papel: { select: { nome: true } } } } }
    });
  },

  async update(id, data) {
    return prisma.usuario.update({
      where: { id: Number(id) },
      data,
      include: { papeis: { select: { papel: { select: { nome: true } } } } }
    });
  },

  async delete(id) {
    return prisma.usuario.delete({ where: { id: Number(id) } });
  }
};