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
    // Limpa usuário antigo se existir
    await prisma.usuario.deleteMany({ where: { email: testUser.email } }).catch(() => {});
    
    // Cria usuário de teste com senha hash
    const senhaHash = await bcrypt.hash(testUser.senha, 10);
    await prisma.usuario.create({
      data: {
        nome: testUser.nome,
        email: testUser.email,
        senha: senhaHash
      }
    });
  });

  afterAll(async () => {
    // Remove usuário de teste
    await prisma.usuario.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("deve autenticar com email e senha corretos", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        senha: testUser.senha
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.usuario.email).toBe(testUser.email);
  });

  it("não deve autenticar com senha incorreta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        senha: "senhaerrada"
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("success", false);
  });

  it("não deve autenticar com email inexistente", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "naoexiste@teste.com",
        senha: "123456"
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("success", false);
  });

});
