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

  // --- NOVOS MÉTODOS DE VERIFICAÇÃO (CORRIGIDOS) ---
  async hasTurmas(id) {
    // Verifica se o usuário está vinculado a alguma turma como professor
    // Nota: Mantenha 'professorId' se for este o nome no seu schema.prisma para Turma
    const turma = await prisma.turma.findFirst({
      where: { professorId: Number(id) }
    });
    return !!turma;
  },

  async hasMatriculas(id) {
    // CORREÇÃO: Alterado de 'alunoId' para 'usuarioId' conforme erro do Prisma
    const matricula = await prisma.matricula.findFirst({
      where: { usuarioId: Number(id) }
    });
    return !!matricula;
  },
  // ----------------------------------------------

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