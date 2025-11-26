import { User } from "../models/User";
import { UserType } from "../models/types/UserTypes";

export class UserRepository {
  async createUser(nome: string, email: string, senha: string, tipo: UserType) {
    const user = await User.create({
      nome,
      email,
      senha,
      tipo,
    });

    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }
}
