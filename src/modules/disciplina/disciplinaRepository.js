import { prisma } from "../../Prisma.js";

class DisciplinaRepository {
  async create(data) {
    return await prisma.disciplina.create({
      data,
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async findAll() {
    return await prisma.disciplina.findMany({
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async findById(id) {
    return await prisma.disciplina.findUnique({
      where: { id: parseInt(id) },
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async findByCodigo(codigo) {
    return await prisma.disciplina.findUnique({
      where: { codigo },
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async findByCurso(cursoId) {
    return await prisma.disciplina.findMany({
      where: { cursoId: parseInt(cursoId) },
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.disciplina.update({
      where: { id: parseInt(id) },
      data,
      include: {
        curso: true,
        turmas: true,
      },
    });
  }

  async delete(id) {
    return await prisma.disciplina.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new DisciplinaRepository();
