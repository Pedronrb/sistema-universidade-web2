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

  describe("create", () => {
    test("Sucesso: Deve criar usuário com hash e papel", async () => {
      const dto = { validate: jest.fn(), email: "test@e.com", senha: "123", nome: "Teste" };
      userRepository.findByEmail.mockResolvedValue(null);
      papelService.getByName.mockResolvedValue({ id: 1, nome: "Aluno" });
      bcrypt.hash.mockResolvedValue("hashed_pwd");

      await userService.create(dto);

      expect(userRepository.createWithRole).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    test("Erro: Deve lançar 409 se o email já estiver em uso", async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1 });
      const dto = { validate: jest.fn(), email: "existe@e.com" };

      await expect(userService.create(dto)).rejects.toThrow(HttpError);
      await expect(userService.create(dto)).rejects.toThrow("Email já cadastrado");
    });
  });

  describe("getById", () => {
    test("Erro: Deve lançar 404 se o usuário não existir", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(userService.getById(999)).rejects.toThrow("Usuário não encontrado");
    });
  });
});