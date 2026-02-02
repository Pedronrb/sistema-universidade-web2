import { prisma } from "../../prisma.js";

export const userRepository = {

  // Listar todos os usuários
  async findAll() {
    return prisma.usuario.findMany({
      include: {
        papeis: {
          select: {
            papel: {
              select: { nome: true }
            }
          }
        }
      }
    });
  },

  // Buscar usuário pelo ID
  async findById(id) {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        papeis: {
          select: {
            papel: { select: { nome: true } },
          },
        },
      },
    });
  },

  // Buscar usuário pelo email (login)
  async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        papeis: {
          select: {
            papel: { select: { nome: true } }
          }
        }
      }
    });
  },

  // Alias semântico para login: username = email
  async findByUsername(username) {
    return this.findByEmail(username);
  },

  // Criar usuário com papel
  async createWithRole({ nome, email, senhaHash, papelId }) {
    return prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papeis: {
          create: { papelId }
        }
      },
      include: {
        papeis: {
          select: { papel: { select: { nome: true } } }
        }
      }
    });
  },

  // Atualizar usuário
  async update(id, data) {
    return prisma.usuario.update({
      where: { id },
      data,
      include: {
        papeis: {
          select: { papel: { select: { nome: true } } }
        }
      }
    });
  },

  // Verifica se usuário é professor de alguma turma
  async hasTurmas(id) {
    const count = await prisma.turma.count({
      where: { professorId: id }
    });
    return count > 0;
  },

  // Verifica se usuário possui alguma matrícula
  async hasMatriculas(id) {
    const count = await prisma.matricula.count({
      where: { usuarioId: id }
    });
    return count > 0;
  },

  // Deletar usuário
  async delete(id) {
    return prisma.usuario.delete({
      where: { id },
    });
  },
};
