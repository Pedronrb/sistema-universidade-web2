import bcrypt from "bcryptjs";
import { userService } from "../../src/modules/user/userService.js";
import { userRepository } from "../../src/modules/user/userRepository.js";
import { papelService } from "../../src/modules/papel/papelService.js";
import { HttpError } from "../../src/middlewares/HttpError.js";

// Mock dos repositórios e serviços externos
jest.mock("../../src/modules/user/userRepository.js");
jest.mock("../../src/modules/papel/papelService.js");
jest.mock("bcryptjs");

describe("User Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("deve criar um usuário padrão com hash da senha", async () => {
      const input = { nome: "João", email: "joao@example.com", senha: "123456" };
      const papelMock = { id: 1, nome: "Aluno" };

      userRepository.findByEmail.mockResolvedValue(null);
      papelService.getByName.mockResolvedValue(papelMock);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userRepository.create.mockResolvedValue({
        id: 1,
        nome: input.nome,
        email: input.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.createUser(input);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(papelService.getByName).toHaveBeenCalledWith("Aluno");
      expect(bcrypt.hash).toHaveBeenCalledWith(input.senha, 10);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("nome", input.nome);
      expect(result).toHaveProperty("email", input.email);
    });

    it("deve lançar erro se email já existir", async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1, email: "joao@example.com" });
      await expect(
        userService.createUser({ nome: "João", email: "joao@example.com", senha: "123456" })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("getById", () => {
    it("deve retornar usuário existente", async () => {
      const userMock = { id: 1, nome: "João", email: "joao@example.com" };
      userRepository.findById.mockResolvedValue(userMock);

      const result = await userService.getById(1);
      expect(result).toEqual(userMock);
    });

    it("deve lançar erro se usuário não encontrado", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getById(999)).rejects.toThrow(HttpError);
    });
  });

  describe("updateUser", () => {
    it("deve atualizar nome e email do usuário", async () => {
      const userMock = { id: 1, nome: "João", email: "joao@example.com" };
      userRepository.findById.mockResolvedValue(userMock);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.update.mockResolvedValue({ ...userMock, nome: "João Atualizado" });

      const result = await userService.updateUser(1, { nome: "João Atualizado" });
      expect(result).toHaveProperty("nome", "João Atualizado");
    });
  });

  describe("deleteUser", () => {
    it("deve deletar usuário existente", async () => {
      const userMock = { id: 1, nome: "João" };
      userRepository.findById.mockResolvedValue(userMock);
      userRepository.delete.mockResolvedValue();

      const result = await userService.deleteUser(1);
      expect(result).toEqual({ message: "Usuário removido com sucesso" });
    });

    it("deve lançar erro se usuário não encontrado", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.deleteUser(999)).rejects.toThrow(HttpError);
    });
  });

});
