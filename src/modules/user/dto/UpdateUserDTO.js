import { HttpError } from "../../../middlewares/HttpError.js";

export class UpdateUserDTO {
  constructor({ nome, email, senha }) {
    this.nome = nome;
    this.email = email?.toLowerCase();
    this.senha = senha;
  }

  validate() {
    if (
      this.nome === undefined &&
      this.email === undefined &&
      this.senha === undefined
    ) {
      throw new HttpError(400, "Informe ao menos um campo para atualização");
    }

    if (this.nome !== undefined) {
      if (typeof this.nome !== "string" || this.nome.trim() === "") {
        throw new HttpError(400, "nome inválido");
      }
    }

    if (this.email !== undefined) {
      if (typeof this.email !== "string" || this.email.trim() === "") {
        throw new HttpError(400, "email inválido");
      }
    }

    if (this.senha !== undefined) {
      if (this.senha.length < 6) {
        throw new HttpError(400, "senha deve ter no mínimo 6 caracteres");
      }
    }
  }
}
