import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

const ROLE = {
  CLIENT: 'Клієнт',
  MANAGER: 'Менеджер',
  TECHNICIAN: 'Майстер',
  BUSINESS: 'Бізнес-клієнт'
};

const PROFILE_TABLE = {
  [ROLE.CLIENT]: 'client_profiles',
  [ROLE.TECHNICIAN]: 'technician_profiles',
  [ROLE.MANAGER]: 'manager_profiles',
  [ROLE.BUSINESS]: 'business_client_profiles'
};

class UsersService {
  async getProfile(userId) {
    const { rows } = await db.query(
      `SELECT id, email, phone, role, created_at FROM users WHERE id = $1`,
      [userId]
    );
    const user = rows[0];
    if (!user) throw ApiError.notFound('User not found');

    const table = PROFILE_TABLE[user.role];
    if (table) {
      let profile = await this._getProfile(table, userId);
      if (!profile) {
        await db.query(
          `INSERT INTO ${table} (user_id)
           VALUES ($1)
           ON CONFLICT (user_id) DO NOTHING`,
          [userId]
        );
        profile = await this._getProfile(table, userId);
      }
      
      if (profile) {
        return {
          ...user,
          first_name: profile.first_name,
          last_name: profile.last_name,
          address: profile.address,
          ...(table === PROFILE_TABLE[ROLE.TECHNICIAN] ? { specialty: profile.specialty } : {}),
          ...(table === PROFILE_TABLE[ROLE.BUSINESS] ? { company_name: profile.company_name, edrpou: profile.edrpou } : {}),
          phone: user.phone,
          email: user.email,
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
    if (!user) throw ApiError.notFound('User not found');

    const { phone, email, first_name, last_name, address, specialty } = data;

    await db.query(
      `UPDATE users
       SET phone = COALESCE($1, phone),
           email = COALESCE($2, email),
           updated_at = NOW()
       WHERE id = $3`,
      [phone ?? null, email ?? null, userId]
    );

    const table = PROFILE_TABLE[user.role];
    if (table === PROFILE_TABLE[ROLE.CLIENT]) {
      await db.query(
        `INSERT INTO client_profiles (user_id, first_name, last_name, address)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           first_name = COALESCE(EXCLUDED.first_name, client_profiles.first_name),
           last_name  = COALESCE(EXCLUDED.last_name, client_profiles.last_name),
           address    = COALESCE(EXCLUDED.address, client_profiles.address)`,
        [userId, first_name ?? null, last_name ?? null, address ?? null]
      );
    } else if (table === PROFILE_TABLE[ROLE.TECHNICIAN]) {
      await db.query(
        `INSERT INTO technician_profiles (user_id, first_name, last_name, specialty)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           first_name = COALESCE(EXCLUDED.first_name, technician_profiles.first_name),
           last_name  = COALESCE(EXCLUDED.last_name, technician_profiles.last_name),
           specialty  = COALESCE(EXCLUDED.specialty, technician_profiles.specialty)`,
        [userId, first_name ?? null, last_name ?? null, specialty ?? null]
      );
    } else if (table === PROFILE_TABLE[ROLE.MANAGER]) {
      await db.query(
        `INSERT INTO manager_profiles (user_id, first_name, last_name)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET
           first_name = COALESCE(EXCLUDED.first_name, manager_profiles.first_name),
           last_name  = COALESCE(EXCLUDED.last_name, manager_profiles.last_name)`,
        [userId, first_name ?? null, last_name ?? null]
      );
    }

    return this.getProfile(userId);
  }
}

export const usersService = new UsersService();