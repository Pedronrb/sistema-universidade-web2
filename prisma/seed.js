import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed completo do SGA...");

  // PAPÉIS
  const papeisNomes = ["admin", "coordenador", "professor", "aluno"];
  const papeis = {};

  for (const nome of papeisNomes) {
    const papel = await prisma.papel.upsert({
      where: { nome },
      update: {},
      create: { nome }
    });
    papeis[nome] = papel;
  }

  console.log("Papéis criados/verificados");

  // FUNÇÃO AUXILIAR USUÁRIO
  const senhaHash = await bcrypt.hash("123456", 10);

  async function criarUsuario(nome, email, papelNome) {
    return prisma.usuario.upsert({
      where: { email },
      update: {},
      create: {
        nome,
        email,
        senha: senhaHash,
        papeis: {
          create: {
            papelId: papeis[papelNome].id
          }
        }
      }
    });
  }

  // USUÁRIOS
  const admin = await criarUsuario("Administrador Geral", "admin@uni.com", "admin");
  const coordenador = await criarUsuario("Coordenador Acadêmico", "coord@uni.com", "coordenador");

  const professor1 = await criarUsuario("Professor 1", "prof1@uni.com", "professor");
  const professor2 = await criarUsuario("Professora 2", "prof2@uni.com", "professor");

  const aluno1 = await criarUsuario("Aluno 1", "aluno1@uni.com", "aluno");
  const aluno2 = await criarUsuario("Aluno 2", "aluno2@uni.com", "aluno");
  const aluno3 = await criarUsuario("Aluno 3", "aluno3@uni.com", "aluno");
  const aluno4 = await criarUsuario("Aluno 4", "aluno4@uni.com", "aluno");

  console.log("Usuários criados");

  // CURSO (Admin cria)
  const cursoSI = await prisma.curso.create({
    data: {
      nome: "Sistemas de Informação",
      descricao: "Curso focado em desenvolvimento e gestão de sistemas"
    }
  });

  console.log("Curso criado");

  // DISCIPLINAS (Coordenador cria)
  const disciplinaBD = await prisma.disciplina.create({
    data: {
      nome: "Banco de Dados",
      codigo: "BD101",
      cargaHoraria: 80,
      cursoId: cursoSI.id
    }
  });

  const disciplinaES = await prisma.disciplina.create({
    data: {
      nome: "Engenharia de Software",
      codigo: "ES102",
      cargaHoraria: 60,
      cursoId: cursoSI.id
    }
  });

  const disciplinaPOO = await prisma.disciplina.create({
    data: {
      nome: "Programação Orientada a Objetos",
      codigo: "POO103",
      cargaHoraria: 80,
      cursoId: cursoSI.id
    }
  });

  console.log("Disciplinas criadas");

  //TURMAS (Coordenador cria)
  const turmaBD = await prisma.turma.create({
    data: {
      codigo: "BD-2026-A",
      periodo: "2026/1",
      disciplinaId: disciplinaBD.id,
      professorId: professor1.id
    }
  });

  const turmaES = await prisma.turma.create({
    data: {
      codigo: "ES-2026-A",
      periodo: "2026/1",
      disciplinaId: disciplinaES.id,
      professorId: professor2.id
    }
  });

  const turmaPOO = await prisma.turma.create({
    data: {
      codigo: "POO-2026-A",
      periodo: "2026/1",
      disciplinaId: disciplinaPOO.id,
      professorId: professor1.id
    }
  });

  console.log("Turmas criadas");

  //MATRÍCULAS (Coordenador realiza)
  const matriculas = [];

  matriculas.push(
    await prisma.matricula.create({
      data: { usuarioId: aluno1.id, turmaId: turmaBD.id }
    })
  );

  matriculas.push(
    await prisma.matricula.create({
      data: { usuarioId: aluno2.id, turmaId: turmaBD.id }
    })
  );

  matriculas.push(
    await prisma.matricula.create({
      data: { usuarioId: aluno3.id, turmaId: turmaES.id }
    })
  );

  matriculas.push(
    await prisma.matricula.create({
      data: { usuarioId: aluno4.id, turmaId: turmaPOO.id }
    })
  );

  console.log("Matrículas realizadas");

  // 8️⃣ NOTAS (Professor lança)
  await prisma.nota.createMany({
    data: [
      { matriculaId: matriculas[0].id, valor: 8.5, etapa: "P1" },
      { matriculaId: matriculas[0].id, valor: 9.0, etapa: "P2" },

      { matriculaId: matriculas[1].id, valor: 7.5, etapa: "P1" },
      { matriculaId: matriculas[2].id, valor: 6.0, etapa: "P1" },

      { matriculaId: matriculas[3].id, valor: 9.5, etapa: "P1" }
    ]
  });

  console.log("Notas lançadas");

  //FREQUÊNCIAS
  const hoje = new Date();
  const ontem = new Date(Date.now() - 86400000);

  for (const m of matriculas) {
    await prisma.frequencia.createMany({
      data: [
        { matriculaId: m.id, data: ontem, presente: true },
        { matriculaId: m.id, data: hoje, presente: true }
      ]
    });
  }

  console.log("Frequências registradas");

  console.log("Seed completo finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });