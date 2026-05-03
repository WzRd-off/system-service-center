import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

const ROLE = {
  CLIENT: 'Клієнт',
  TECHNICIAN: 'Майстер',
  BUSINESS: 'Бізнес-клієнт',
};

const PROFILE_TABLE = {
  [ROLE.CLIENT]: 'client_profiles',
  [ROLE.TECHNICIAN]: 'technician_profiles',
};

class UsersService {
  async getProfile(userId) {
    const { rows } = await db.query(
      `SELECT id, email, phone, role, created_at FROM users WHERE id = $1`,
      [userId]
    );
    const user = rows[0];
    if (!user) throw ApiError.notFound('Користувача не знайдено');

    const table = PROFILE_TABLE[user.role];
    if (table) {
      let profile = await this._getProfile(table, userId);
      if (!profile) {
        await db.query(
          `INSERT INTO ${table} (user_id, email)
           VALUES ($1, $2)
           ON CONFLICT (user_id) DO NOTHING`,
          [userId, user.email]
        );
        profile = await this._getProfile(table, userId);
      }
      if (profile) {
        return {
          ...user,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone || user.phone,
          email: profile.email || user.email,
        };
      }
    }
    return user;
  }

  async _getProfile(table, userId) {
    const { rows } = await db.query(`SELECT * FROM ${table} WHERE user_id = $1`, [userId]);
    return rows[0];
  }

  async updateProfile(userId, data) {
    const { rows: userRows } = await db.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [userId]
    );
    const user = userRows[0];
    if (!user) throw ApiError.notFound('Користувача не знайдено');

    const { phone, email, first_name, last_name } = data;

    await db.query(
      `UPDATE users
       SET phone = COALESCE($1, phone),
           email = COALESCE($2, email),
           updated_at = NOW()
       WHERE id = $3`,
      [phone ?? null, email ?? null, userId]
    );

    const table = PROFILE_TABLE[user.role];
    if (table) {
      await db.query(
        `INSERT INTO ${table} (user_id, first_name, last_name, phone, email)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO UPDATE SET
           first_name = COALESCE(EXCLUDED.first_name, ${table}.first_name),
           last_name  = COALESCE(EXCLUDED.last_name,  ${table}.last_name),
           phone      = COALESCE(EXCLUDED.phone,      ${table}.phone),
           email      = COALESCE(EXCLUDED.email,      ${table}.email)`,
        [userId, first_name ?? null, last_name ?? null, phone ?? null, email ?? null]
      );
    }

    return this.getProfile(userId);
  }
}

export const usersService = new UsersService();
