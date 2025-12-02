"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    repository = new UserRepository_1.UserRepository();
    async create(user) {
        return this.repository.create(user);
    }
    async list() {
        return this.repository.findAll();
    }
    async find(id) {
        return this.repository.findById(id);
    }
    async update(id, data) {
        return this.repository.update(id, data);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map