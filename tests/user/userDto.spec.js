import { CreateUserDTO } from "../../src/modules/user/dto/CreateUserDTO.js";
import { UpdateUserDTO } from "../../src/modules/user/dto/UpdateUserDTO.js";

describe("User DTOs - Unit Tests", () => {
  
  describe("CreateUserDTO", () => {
    test("Deve validar com sucesso quando todos os dados são válidos", () => {
      const dto = new CreateUserDTO({ 
        nome: "Admin", 
        email: "ADMIN@teste.com", 
        senha: "password123", 
        papelNome: "admin" 
      });
      expect(() => dto.validate()).not.toThrow();
      expect(dto.email).toBe("admin@teste.com"); // Verifica conversão para lowercase
    });

    test("Deve lançar erro se faltar campos obrigatórios", () => {
      const dto = new CreateUserDTO({ nome: "A" }); // Falta email e senha
      expect(() => dto.validate()).toThrow("nome, email e senha são obrigatórios");
    });

    test("Deve lançar erro se a senha tiver menos de 6 caracteres", () => {
      const dto = new CreateUserDTO({ nome: "A", email: "a@a.com", senha: "123" });
      expect(() => dto.validate()).toThrow("senha deve ter no mínimo 6 caracteres");
    });

    test("Deve lançar erro se papelNome for enviado mas for inválido (vazio)", () => {
      const dto = new CreateUserDTO({ 
        nome: "A", 
        email: "a@a.com", 
        senha: "123456", 
        papelNome: "   " 
      });
      expect(() => dto.validate()).toThrow("papelNome inválido");
    });

    test("Deve aceitar se papelNome não for enviado (valor padrão)", () => {
      const dto = new CreateUserDTO({ nome: "A", email: "a@a.com", senha: "123456" });
      expect(() => dto.validate()).not.toThrow();
    });
  });

  describe("UpdateUserDTO", () => {
    test("Deve validar com sucesso e formatar e-mail se enviado", () => {
      const dto = new UpdateUserDTO({ email: "NOVO@EMAIL.COM" });
      expect(() => dto.validate()).not.toThrow();
    });

    test("Deve lançar erro se formato de e-mail for inválido", () => {
      const dto = new UpdateUserDTO({ email: "email_ruim" });
      expect(() => dto.validate()).toThrow("Formato de e-mail inválido");
    });

    test("Deve lançar erro se nova senha for muito curta", () => {
      const dto = new UpdateUserDTO({ senha: "123" });
      expect(() => dto.validate()).toThrow("A nova senha deve ter no mínimo 6 caracteres");
    });

    test("Deve permitir DTO totalmente vazio (atualização opcional)", () => {
      const dto = new UpdateUserDTO({});
      expect(() => dto.validate()).not.toThrow();
    });
  });
});