import { pool } from "../database/connection";
import { User } from "../models/User";

export class UserRepository {

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (nome, email, senha, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user.nome, user.email, user.senha, user.role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users;");
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    return result.rows[0] || null;
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
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
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id = $1;", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
