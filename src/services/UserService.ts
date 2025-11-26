import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";

export class UserService {
  private repository = new UserRepository();

  async create(user: User) {
    return this.repository.create(user);
  }

  async list() {
    return this.repository.findAll();
  }

  async find(id: number) {
    return this.repository.findById(id);
  }

  async update(id: number, data: Partial<User>) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
