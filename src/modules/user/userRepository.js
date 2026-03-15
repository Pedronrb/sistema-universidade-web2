import { prisma } from "../../prisma.js";

export const userRepository = {
  async findAll() {
    return prisma.usuario.findMany({
      include: {
        papeis: { select: { papel: { select: { nome: true } } } },
      },
    });
  },

  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        papeis: { select: { papel: { select: { nome: true } } } },
      },
    });
  },

  async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        papeis: { select: { papel: { select: { nome: true } } } },
      },
    });
  },

  async findByUsername(username) {
    return this.findByEmail(username);
  },

  async hasTurmas(id) {
    const turma = await prisma.turma.findFirst({
      where: { professorId: Number(id) },
    });
    return !!turma;
  },

  async hasMatriculas(id) {
    const matricula = await prisma.matricula.findFirst({
      where: { usuarioId: Number(id) },
    });
    return !!matricula;
  },

  async createWithRole({ nome, email, senhaHash, papelId }) {
    return prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papeis: { create: { papelId } },
      },
      include: { papeis: { select: { papel: { select: { nome: true } } } } },
    });
  },

  async update(id, data) {
    return prisma.usuario.update({
      where: { id: Number(id) },
      data,
      include: { papeis: { select: { papel: { select: { nome: true } } } } },
    });
  },

  async updatePapel(userId, papelId) {
    // Remove papéis atuais e insere o novo
    await prisma.usuarioPapel.deleteMany({ where: { usuarioId: userId } });
    await prisma.usuarioPapel.create({ data: { usuarioId: userId, papelId } });
    return this.findById(userId);
  },

  async delete(id) {
    const userId = Number(id);

    return prisma.$transaction([
      prisma.usuarioPapel.deleteMany({
        where: { usuarioId: userId },
      }),

      prisma.usuario.delete({
        where: { id: userId },
      }),
    ]);
  },
};
