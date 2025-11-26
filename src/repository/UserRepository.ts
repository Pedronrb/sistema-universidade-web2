import { User } from "../models/User";
import { UserTypes } from "../models/types/UserTypes";

export class UserRepository {
  async createUser(
    name: string,
    email: string,
    password: string,
    type: UserTypes,
  ) {
    const user = await User.create({
      name,
      email,
      password,
      type,
    });

    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }
}
