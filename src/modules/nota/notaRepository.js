import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class NotaRepository {
  async create(data) {
    return await prisma.nota.create({
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
    return await prisma.nota.findMany({
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
    return await prisma.nota.findUnique({
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
    return await prisma.nota.findMany({
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
    });
  }

  async getByMatriculaAndEtapa(matriculaId, etapa) {
    return await prisma.nota.findFirst({
      where: {
        matriculaId: parseInt(matriculaId),
        etapa,
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
    return await prisma.nota.update({
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
    return await prisma.nota.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const notaRepository = new NotaRepository();
