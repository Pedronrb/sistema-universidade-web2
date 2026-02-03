import { LoginDTO } from "../../src/modules/auth/dto/LoginDTO.js";

describe("LoginDTO - Unit Tests", () => {
  test("Deve falhar se e-mail estiver ausente", () => {
    const dto = new LoginDTO({ senha: "123456" });
    expect(() => dto.validate()).toThrow("Email e senha são obrigatórios");
  });

  test("Deve falhar se e-mail não for string", () => {
    const dto = new LoginDTO({ email: 123, senha: "123456" });
    expect(() => dto.validate()).toThrow("Email inválido");
  });

  test("Deve falhar se senha for curta", () => {
    const dto = new LoginDTO({ email: "test@test.com", senha: "123" });
    expect(() => dto.validate()).toThrow("Senha deve ter no mínimo 6 caracteres");
  });
});