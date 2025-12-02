"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const connection_1 = require("../database/connection");
class UserRepository {
    async create(user) {
        const query = `
      INSERT INTO users (nome, email, senha, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [user.nome, user.email, user.senha, user.role];
        const result = await connection_1.pool.query(query, values);
        return result.rows[0];
    }
    async findAll() {
        const result = await connection_1.pool.query("SELECT * FROM users;");
        return result.rows;
    }
    async findById(id) {
        const result = await connection_1.pool.query("SELECT * FROM users WHERE id = $1;", [id]);
        return result.rows[0] || null;
    }
    async update(id, user) {
        const query = `
      UPDATE users
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          senha = COALESCE($3, senha),
          role = COALESCE($4, role)
      WHERE id = $5
      RETURNING *;
    `;
        const values = [user.nome, user.email, user.senha, user.role, id];
        const result = await connection_1.pool.query(query, values);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await connection_1.pool.query("DELETE FROM users WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map