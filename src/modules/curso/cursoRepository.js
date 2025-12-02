import { prisma } from "../../Prisma.js";

class CursoRepository {
  async create(data) {
    return await prisma.curso.create({
      data,
      include: {
        disciplinas: true,
      },
    });
  }

  async findAll() {
    return await prisma.curso.findMany({
      include: {
        disciplinas: true,
      },
    });
  }

  async findById(id) {
    return await prisma.curso.findUnique({
      where: { id: parseInt(id) },
      include: {
        disciplinas: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.curso.update({
      where: { id: parseInt(id) },
      data,
      include: {
        disciplinas: true,
      },
    });
  }

  async delete(id) {
    return await prisma.curso.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new CursoRepository();
