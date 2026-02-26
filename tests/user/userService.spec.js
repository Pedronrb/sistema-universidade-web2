import bcrypt from "bcryptjs";
import { userService } from "../../src/modules/user/userService.js";
import { userRepository } from "../../src/modules/user/userRepository.js";
import { papelService } from "../../src/modules/papel/papelService.js";
import { HttpError } from "../../src/middlewares/HttpError.js";

jest.mock("../../src/modules/user/userRepository.js", () => ({
  userRepository: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    createWithRole: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    hasTurmas: jest.fn(),
    hasMatriculas: jest.fn()
  }
}));

jest.mock("../../src/modules/papel/papelService.js");
jest.mock("bcryptjs");

describe("UserService - Unit Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  // BUSCA
  describe("getById & getByIdWithRoles", () => {
    test("getById: Deve lançar 404 se usuário não existir", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getById(99)).rejects.toThrow(HttpError);
    });

    test("getByIdWithRoles: Deve formatar papéis corretamente", async () => {
      const mockUser = { id: 1, papeis: [{ papel: { nome: "admin" } }] };
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getByIdWithRoles(1);
      expect(result.papeis[0].nome).toBe("admin");
    });

    test("getByIdWithRoles: Deve lançar 404 se usuário não existir", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getByIdWithRoles(99)).rejects.toThrow("Usuário não encontrado");
    });
  });

  // CRIAÇÃO
  describe("create", () => {
    test("Deve criar usuário com hash e papel informado", async () => {
      const dto = {
        validate: jest.fn(),
        email: "test@e.com",
        senha: "123",
        nome: "Teste",
        papelNome: "aluno" 
      };

      userRepository.findByEmail.mockResolvedValue(null);
      papelService.getByName.mockResolvedValue({ id: 1, nome: "aluno" });
      bcrypt.hash.mockResolvedValue("hashed_pwd");

      await userService.create(dto);

      expect(userRepository.createWithRole).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Teste",
          email: "test@e.com",
          senhaHash: "hashed_pwd",
          papelId: 1
        })
      );
    });

    test("Deve lançar 409 se o email já estiver em uso", async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1 });

      const dto = {
        validate: jest.fn(),
        email: "existe@e.com",
        senha: "123",
        nome: "Teste",
        papelNome: "aluno"
      };

      await expect(userService.create(dto)).rejects.toThrow("Email já cadastrado");
    });
  });

  // ATUALIZAÇÃO
  describe("update", () => {
    test("Deve permitir update se o email for do próprio usuário", async () => {
      userRepository.findById.mockResolvedValue({ id: 1, email: "meu@email.com" });
      userRepository.findByEmail.mockResolvedValue({ id: 1 });

      const dto = {
        validate: jest.fn(),
        email: "meu@email.com",
        nome: "Novo Nome"
      };

      await userService.update(1, dto);
      expect(userRepository.update).toHaveBeenCalled();
    });

    test("Deve retornar o usuário sem chamar o banco se o DTO for vazio", async () => {
      const mockUser = { id: 1, nome: "Antigo" };
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.update(1, { validate: jest.fn() });

      expect(result).toEqual(mockUser);
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    test("Deve lançar 409 se email pertencer a outro usuário", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.findByEmail.mockResolvedValue({ id: 2 });

      const dto = {
        validate: jest.fn(),
        email: "outro@email.com"
      };

      await expect(userService.update(1, dto)).rejects.toThrow(
        "Email já cadastrado por outro usuário"
      );
    });
  });

  // EXCLUSÃO
  // =========================
  describe("delete", () => {
    test("Deve deletar usuário quando não há vínculos", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(false);
      userRepository.hasMatriculas.mockResolvedValue(false);

      await userService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    test("Não deve deletar usuário com turmas (Professor)", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(true);

      await expect(userService.delete(1)).rejects.toThrow(
        "possui turmas associadas"
      );
    });

    test("Erro: Não deve deletar usuário com matrículas (Aluno)", async () => {
      userRepository.findById.mockResolvedValue({ id: 1 });
      userRepository.hasTurmas.mockResolvedValue(false);
      userRepository.hasMatriculas.mockResolvedValue(true);

      await expect(userService.delete(1)).rejects.toThrow(
        "possui matrículas associadas"
      );
    });
  });
});