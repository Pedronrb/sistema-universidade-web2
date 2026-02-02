import { HttpError } from "../../../middlewares/HttpError.js";

export class CreateUserDTO {
  constructor({ nome, email, senha, papelNome }) {
    this.nome = nome;
    this.email = email?.toLowerCase();
    this.senha = senha;
    this.papelNome = papelNome;
  }

  validate() {
    if (!this.nome || !this.email || !this.senha) {
      throw new HttpError(400, "nome, email e senha são obrigatórios");
    }

    if (this.senha.length < 6) {
      throw new HttpError(400, "senha deve ter no mínimo 6 caracteres");
    }

    if (
      this.papelNome !== undefined &&
      (typeof this.papelNome !== "string" || this.papelNome.trim() === "")
    ) {
      throw new HttpError(400, "papelNome inválido");
    }
  }
}
