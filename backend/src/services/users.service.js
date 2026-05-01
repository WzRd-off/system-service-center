import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class UsersService {
  async getProfile(userId) {
    const { rows } = await db.query(
      `SELECT id, email, phone, role, created_at FROM users WHERE id = $1`,
      [userId]
    );
    if (!rows[0]) throw ApiError.notFound('Користувача не знайдено');
    return rows[0];
  }

  async updateProfile(userId, { phone, email }) {
    const { rows } = await db.query(
      `UPDATE users
       SET phone = COALESCE($1, phone),
           email = COALESCE($2, email),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, phone, role`,
      [phone, email, userId]
    );
    return rows[0];
  }
}

export const usersService = new UsersService();
