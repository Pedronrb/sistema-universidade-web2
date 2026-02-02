import { HttpError } from "../../../middlewares/HttpError.js";

export class LoginDTO {
  constructor({ email, senha }) {
    this.email = email;
    this.senha = senha;
  }

  validate() {
    if (!this.email || !this.senha) {
      throw new HttpError(400, "Email e senha são obrigatórios");
    }

    if (typeof this.email !== "string" || this.email.trim() === "") {
      throw new HttpError(400, "Email inválido");
    }

    if (typeof this.senha !== "string" || this.senha.length < 6) {
      throw new HttpError(400, "Senha deve ter no mínimo 6 caracteres");
    }
  }
}
