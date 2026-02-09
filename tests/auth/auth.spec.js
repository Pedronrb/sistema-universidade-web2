import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/app.js";
import { prisma } from "../../src/prisma.js";

describe("Autenticação - /auth/login", () => {
  const testUser = {
    nome: "Teste Usuário",
    email: "teste@teste.com",
    senha: "123456"
  };

  beforeAll(async () => {
    // Limpeza para garantir estado consistente
    await prisma.usuarioPapel.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.papel.deleteMany();

    // Cria papel admin para o teste
    const papel = await prisma.papel.create({ data: { nome: "admin" } });
    const senhaHash = await bcrypt.hash(testUser.senha, 10);

    await prisma.usuario.create({
      data: {
        nome: testUser.nome,
        email: testUser.email,
        senha: senhaHash,
        papeis: { create: { papelId: papel.id } }
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve autenticar com email e senha corretos", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, senha: testUser.senha });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it("não deve autenticar com senha incorreta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, senha: "errada" });

    expect(response.status).toBe(401);
  });
});