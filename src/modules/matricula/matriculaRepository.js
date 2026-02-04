import { prisma } from "../../prisma.js";

class MatriculaRepository {
  async create(data) {
    return await prisma.matricula.create({
      data,
      include: {
        usuario: true,
        turma: {
          include: {
            disciplina: true,
            professor: true,
          },
        },
        notas: true,
        frequencias: true,
      },
    });
  }

  async getAll() {
    return await prisma.matricula.findMany({
      include: {
        usuario: true,
        turma: {
          include: {
            disciplina: true,
            professor: true,
          },
        },
        notas: true,
        frequencias: true,
      },
    });
  }

  async getById(id) {
    return await prisma.matricula.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: true,
        turma: {
          include: {
            disciplina: true,
            professor: true,
          },
        },
        notas: true,
        frequencias: true,
      },
    });
  }

  async getByUsuario(usuarioId) {
    return await prisma.matricula.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: {
        usuario: true,
        turma: {
          include: {
            disciplina: true,
            professor: true,
          },
        },
        notas: true,
        frequencias: true,
      },
    });
  }

  async getByTurma(turmaId) {
    return await prisma.matricula.findMany({
      where: { turmaId: parseInt(turmaId) },
      include: {
        usuario: true,
        turma: {
          include: {
            disciplina: true,
          },
        },
        notas: true,
        frequencias: true,
      },
    });
  }

  async getByUsuarioAndTurma(usuarioId, turmaId) {
    return await prisma.matricula.findFirst({
      where: {
        usuarioId: parseInt(usuarioId),
        turmaId: parseInt(turmaId),
      },
      include: {
        usuario: true,
        turma: true,
        notas: true,
        frequencias: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.matricula.update({
      where: { id: parseInt(id) },
      data,
      include: {
        usuario: true,
        turma: true,
        notas: true,
        frequencias: true,
      },
    });
  }

  async delete(id) {
    return await prisma.matricula.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const matriculaRepository = new MatriculaRepository();
