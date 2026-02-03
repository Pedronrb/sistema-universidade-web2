import { prisma } from "../../prisma.js"; 

export const papelRepository = {
  async create(data) {
    return prisma.papel.create({ data });
  },

  async findAll() {
    return prisma.papel.findMany();
  },

  async findById(id) {
    return prisma.papel.findUnique({
      where: { id: Number(id) },
    });
  },

  /**
   * Ajuste Sênior: Usamos findFirst com 'mode: insensitive'.
   * Isso resolve o erro 500 (falta de índice unique) e o 404 (erro de maiúsculas).
   */
  async findByName(nome) {
    return prisma.papel.findFirst({
      where: { 
        nome: {
          equals: nome,
          mode: 'insensitive'
        } 
      },
    });
  },

  async delete(id) {
    return prisma.papel.delete({
      where: { id: Number(id) },
    });
  },

  async update(id, data) {
    return prisma.papel.update({
      where: { id: Number(id) },
      data,
    });
  }
};