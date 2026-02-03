import request from "supertest";
import { prisma } from "../../src/prisma.js";
import app from "../../src/app.js";
import { generateToken } from "../../src/utils/auth.js";

let tokenAdmin, tokenAluno, adminId, alunoId;

describe("User Routes - Full Integration & RBAC Test", () => {
  beforeAll(async () => {
    // Limpeza e criação de papéis/usuários base
    await prisma.usuarioPapel.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.papel.deleteMany();

    const pAdmin = await prisma.papel.create({ data: { nome: "admin" } });
    const pAluno = await prisma.papel.create({ data: { nome: "aluno" } });

    const admin = await prisma.usuario.create({
      data: { nome: "Admin", email: "admin@test.com", senha: "hash", papeis: { create: { papelId: pAdmin.id } } }
    });
    const aluno = await prisma.usuario.create({
      data: { nome: "Aluno", email: "aluno@test.com", senha: "hash", papeis: { create: { papelId: pAluno.id } } }
    });

    adminId = admin.id;
    alunoId = aluno.id;
    tokenAdmin = "Bearer " + generateToken({ ...admin, papeis: [{ papel: { nome: "admin" } }] });
    tokenAluno = "Bearer " + generateToken({ ...aluno, papeis: [{ papel: { nome: "aluno" } }] });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- LISTAGEM (GET /users) ---
  describe("GET /users", () => {
    it("Sucesso: Admin lista todos os usuários", async () => {
      const res = await request(app).get("/users").set("Authorization", tokenAdmin);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("Erro: Aluno recebe 403 ao tentar listar", async () => {
      const res = await request(app).get("/users").set("Authorization", tokenAluno);
      expect(res.status).toBe(403);
    });
  });

  // --- CRIAÇÃO (POST /users) ---
  describe("POST /users", () => {
    const newUser = { nome: "Novo", email: "novo@e.com", senha: "password123", papelNome: "aluno" };

    it("Sucesso: Admin cria novo usuário", async () => {
      const res = await request(app).post("/users").set("Authorization", tokenAdmin).send(newUser);
      expect(res.status).toBe(201);
    });

    it("Erro: Admin tenta criar usuário com email já existente (409)", async () => {
      const res = await request(app).post("/users").set("Authorization", tokenAdmin).send({ ...newUser, email: "admin@test.com" });
      expect(res.status).toBe(409);
    });

    it("Erro: Tentativa de criar sem campos obrigatórios (400)", async () => {
      const res = await request(app).post("/users").set("Authorization", tokenAdmin).send({ nome: "Incompleto" });
      expect(res.status).toBe(400);
    });
  });

  // --- BUSCA POR ID (GET /users/:id) ---
  describe("GET /users/:id", () => {
    it("Sucesso: Admin busca usuário existente", async () => {
      const res = await request(app).get(`/users/${alunoId}`).set("Authorization", tokenAdmin);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(alunoId);
    });

    it("Erro: Busca por ID inexistente (404)", async () => {
      const res = await request(app).get("/users/9999").set("Authorization", tokenAdmin);
      expect(res.status).toBe(404);
    });
  });

  // --- ATUALIZAÇÃO (PUT /users/:id) ---
  describe("PUT /users/:id", () => {
    it("Sucesso: Admin atualiza nome do usuário", async () => {
      const res = await request(app)
        .put(`/users/${alunoId}`)
        .set("Authorization", tokenAdmin)
        .send({ nome: "Nome Atualizado" });
      expect(res.status).toBe(200);
    });

    it("Erro: Aluno tenta atualizar outro usuário (403)", async () => {
      const res = await request(app)
        .put(`/users/${adminId}`)
        .set("Authorization", tokenAluno)
        .send({ nome: "Hacker" });
      expect(res.status).toBe(403);
    });
  });

  // --- (DELETE /users/:id) ---
  describe("DELETE /users/:id", () => {
    it("Sucesso: Admin deleta usuário", async () => {
      // Criar um usuário temporário para deletar
      const temp = await prisma.usuario.create({ data: { nome: "Temp", email: "temp@t.com", senha: "1" } });
      const res = await request(app).delete(`/users/${temp.id}`).set("Authorization", tokenAdmin);
      expect(res.status).toBe(204);
    });

    it("Erro: Admin tenta deletar usuário inexistente (404)", async () => {
      const res = await request(app).delete("/users/9999").set("Authorization", tokenAdmin);
      expect(res.status).toBe(404);
    });
    
    it("Segurança: Aluno tenta deletar usuário (403)", async () => {
      const res = await request(app).delete(`/users/${adminId}`).set("Authorization", tokenAluno);
      expect(res.status).toBe(403);
    });
  });
});