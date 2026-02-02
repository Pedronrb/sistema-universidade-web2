import { userRepository } from "../user/userRepository.js";
import { comparePassword, generateToken } from "../../utils/auth.js";
import { HttpError } from "../../middlewares/HttpError.js";

export const authService = {

  async login(dto) {
    dto.validate();

    const user = await userRepository.findByUsername(dto.email);
    if (!user) {
      throw new HttpError(401, "Email ou senha inválidos");
    }

    const isPasswordValid = await comparePassword(dto.senha, user.senha);
    if (!isPasswordValid) {
      throw new HttpError(401, "Email ou senha inválidos");
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papeis: user.papeis.map(p => p.papel.nome)
      },
      token
    };
  }
};
