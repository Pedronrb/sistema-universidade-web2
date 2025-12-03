import { prisma } from "../../Prisma.js";

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

  async findByName(nome) {
    return prisma.papel.findUnique({
      where: { nome },
    });
  },
};