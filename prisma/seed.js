import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o processo de seed...");

  const papeisNomes = ["admin", "coordenador", "professor", "aluno"];
  
  // Mapa para armazenar os objetos de papel retornados pelo banco
  const mapeamentoPapeis = {};

  console.log("--- Criando/Verificando Papéis ---");
  for (const nome of papeisNomes) {
    // CORREÇÃO: Usamos 'where: { nome }' para evitar conflito de Unique Constraint
    const papel = await prisma.papel.upsert({
      where: { nome: nome }, 
      update: {},
      create: { nome: nome },
    });
    mapeamentoPapeis[nome] = papel;
    console.log(`Papel verificado/criado: ${nome} (ID: ${papel.id})`);
  }

  console.log("\n--- Criando Usuário Administrador ---");
  const adminEmail = "admin@universidade.com";
  const senhaHash = await bcrypt.hash("admin123", 10);

  const papelAdmin = mapeamentoPapeis["admin"];

  if (!papelAdmin) {
    throw new Error("Erro crítico: Papel 'admin' não encontrado no banco.");
  }

  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: "Administrador do Sistema",
      email: adminEmail,
      senha: senhaHash,
      papeis: {
        create: {
          papelId: papelAdmin.id
        }
      }
    }
  });

  console.log(`Admin pronto: ${adminEmail} / admin123`);
  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante o seed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });