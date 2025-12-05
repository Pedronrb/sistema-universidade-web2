import { prisma } from "../../prisma.js";

class TurmaRepository {
  async create(data) {
    return await prisma.turma.create({
      data,
      include: {
        disciplina: true,
        professor: true,
        matriculas: true,
      },
    });
  }

  async getAll() {
    return await prisma.turma.findMany({
      include: {
        disciplina: true,
        professor: true,
        matriculas: true,
      },
    });
  }

  async getById(id) {
    return await prisma.turma.findUnique({
      where: { id: parseInt(id) },
      include: {
        disciplina: true,
        professor: true,
        matriculas: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async getByProfessor(professorId) {
    return await prisma.turma.findMany({
      where: { professorId: parseInt(professorId) },
      include: {
        disciplina: true,
        professor: true,
        matriculas: true,
      },
    });
  }

  async getByDisciplina(disciplinaId) {
    return await prisma.turma.findMany({
      where: { disciplinaId: parseInt(disciplinaId) },
      include: {
        disciplina: true,
        professor: true,
        matriculas: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.turma.update({
      where: { id: parseInt(id) },
      data,
      include: {
        disciplina: true,
        professor: true,
        matriculas: true,
      },
    });
  }

  async delete(id) {
    return await prisma.turma.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const turmaRepository = new TurmaRepository();
