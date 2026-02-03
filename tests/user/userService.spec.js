import bcrypt from "bcryptjs";
import { userService } from "../../src/modules/user/userService.js";
import { userRepository } from "../../src/modules/user/userRepository.js";
import { papelService } from "../../src/modules/papel/papelService.js";
import { HttpError } from "../../src/middlewares/HttpError.js";

jest.mock("../../src/modules/user/userRepository.js");
jest.mock("../../src/modules/papel/papelService.js");
jest.mock("bcryptjs");

describe("UserService - Unit Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- BUSCA ---
  describe("getById & getByIdWithRoles", () => {
    test("getById - Erro: Deve lançar 404 se usuário não existir", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getById(99)).rejects.toThrow(HttpError);
    });

    test("getByIdWithRoles - Sucesso: Deve formatar papéis corretamente", async () => {
      const mockUser = { id: 1, papeis: [{ papel: { nome: "admin" } }] };
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getByIdWithRoles(1);
      expect(result.papeis[0].nome).toBe("admin");
    });

    test("getByIdWithRoles - Erro: Deve lançar 404 se usuário não existir", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getByIdWithRoles(99)).rejects.toThrow("Usuário não encontrado");
    });
  });

  // --- CRIAÇÃO ---
  describe("create", () => {
    test("Sucesso: Deve criar usuário com hash e papel padrão", async () => {
      const dto = { validate: jest.fn(), email: "test@e.com", senha: "123", nome: "Teste" };
      userRepository.findByEmail.mockResolvedValue(null);
      papelService.getByName.mockResolvedValue({ id: 1, nome: "aluno" });
      bcrypt.hash.mockResolvedValue("hashed_pwd");

      await userService.create(dto);

      expect(userRepository.createWithRole).toHaveBeenCalledWith(expect.objectContaining({
        senhaHash: "hashed_pwd",
        papelId: 1
      }));
    });

    test("Erro: Deve lançar 409 se o email já estiver em uso", async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1 });
      const dto = { validate: jest.fn(), email: "existe@e.com" };

      await expect(userService.create(dto)).rejects.toThrow("Email já cadastrado");
    });
  });

  // --- ATUALIZAÇÃO ---
  describe("update", () => {
    test("Sucesso: Deve permitir update se o email for do próprio usuário", async () => {
      userRepository.findById.mockResolvedValue({ id: 1, email: "meu@email.com" });
      userRepository.findByEmail.mockResolvedValue({ id: 1 }); 
      const dto = { validate: jest.fn(), email: "meu@email.com", nome: "Novo Nome" };

      await userService.update(1, dto);
      expect(userRepository.update).toHaveBeenCalled();
    });

    test("Sucesso: Deve retornar o usuário sem chamar o banco se o DTO for vazio", async () => {
      const mockUser = { id: 1, nome: "Antigo" };
      userRepository.findById.mockResolvedValue(mockUser);
      
      // Criando um DTO que não tem campos para atualizar (cobre a linha 80/82)
      const result = await userService.update(1, { validate: jest.fn() });
      
      expect(result).toEqual(mockUser);
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    test("Erro: Deve lançar 409 se email pertencer a outro usuário", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.findByEmail.mockResolvedValue({ id: 2 }); 
      const dto = { validate: jest.fn(), email: "outro@email.com" };

      await expect(userService.update(1, dto)).rejects.toThrow("Email já cadastrado por outro usuário");
    });
  });

  // --- EXCLUSÃO ---
  describe("delete", () => {
    test("Sucesso: Deve deletar usuário quando não há vínculos", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(false);
      userRepository.hasMatriculas.mockResolvedValue(false);

      await userService.delete(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    test("Erro: Não deve deletar usuário com turmas (Professor)", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(true);

      await expect(userService.delete(1)).rejects.toThrow("possui turmas associadas");
    });

    test("Erro: Não deve deletar usuário com matrículas (Aluno)", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(false);
      userRepository.hasMatriculas.mockResolvedValue(true);

      await expect(userService.delete(1)).rejects.toThrow("possui matrículas associadas");
    });
  });
});