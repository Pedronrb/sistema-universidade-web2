import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o processo de seed...");

  const papeisNomes = ["admin", "coordenador", "professor", "aluno"];
  
  // Criamos os papéis e armazenamos os objetos retornados em um mapa para acesso rápido
  const mapeamentoPapeis = {};

  console.log("--- Criando/Verificando Papéis ---");
  for (const nome of papeisNomes) {
    const papel = await prisma.papel.upsert({
      where: { id: papeisNomes.indexOf(nome) + 1 },
      update: {},
      create: { nome: nome },
    });
    mapeamentoPapeis[nome] = papel;
    console.log(`Papel: ${nome}`);
  }

  console.log("\n--- Criando Usuário Administrador ---");
  const adminEmail = "admin@universidade.com";
  const senhaHash = await bcrypt.hash("admin123", 10);

  // Agora usamos o objeto que o próprio Prisma acabou de nos retornar
  const papelAdmin = mapeamentoPapeis["admin"];

  if (!papelAdmin) {
    throw new Error(" Erro crítico: Papel 'admin' não encontrado no mapeamento local.");
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

  console.log(`🚀 Admin pronto: ${adminEmail} / admin123`);
  console.log("✨ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(" Erro durante o seed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });