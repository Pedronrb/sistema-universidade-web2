import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class FrequenciaRepository {
  async create(data) {
    return await prisma.frequencia.create({
      data,
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: {
              include: {
                disciplina: true,
              },
            },
          },
        },
      },
    });
  }

  async getAll() {
    return await prisma.frequencia.findMany({
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: {
              include: {
                disciplina: true,
              },
            },
          },
        },
      },
    });
  }

  async getById(id) {
    return await prisma.frequencia.findUnique({
      where: { id: parseInt(id) },
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: {
              include: {
                disciplina: true,
              },
            },
          },
        },
      },
    });
  }

  async getByMatricula(matriculaId) {
    return await prisma.frequencia.findMany({
      where: { matriculaId: parseInt(matriculaId) },
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: {
              include: {
                disciplina: true,
              },
            },
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async getByMatriculaAndData(matriculaId, data) {
    return await prisma.frequencia.findFirst({
      where: {
        matriculaId: parseInt(matriculaId),
        data: new Date(data),
      },
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: true,
          },
        },
      },
    });
  }

  async getByTurmaAndData(turmaId, data) {
    return await prisma.frequencia.findMany({
      where: {
        matricula: {
          turmaId: parseInt(turmaId),
        },
        data: new Date(data),
      },
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.frequencia.update({
      where: { id: parseInt(id) },
      data,
      include: {
        matricula: {
          include: {
            usuario: true,
            turma: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.frequencia.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const frequenciaRepository = new FrequenciaRepository();
