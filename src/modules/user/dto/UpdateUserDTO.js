import { HttpError } from "../../../middlewares/HttpError.js";

export class UpdateUserDTO {
  constructor({ nome, email, senha }) {
    this.nome = nome;
    this.email = email?.toLowerCase();
    this.senha = senha;
  }

  validate() {
    // Na atualização, os campos são opcionais. Validamos apenas se existirem.
    if (this.email && (!this.email.includes("@") || this.email.length < 5)) {
      throw new HttpError(400, "Formato de e-mail inválido");
    }
    if (this.senha && this.senha.length > 0 && this.senha.length < 6) {
      throw new HttpError(400, "A nova senha deve ter no mínimo 6 caracteres");
    }
  }
}