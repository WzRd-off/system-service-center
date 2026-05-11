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

  async listOrderableClients({ search = '', limit = 30 } = {}) {
    const lim = Math.min(Math.max(Number(limit) || 30, 1), 50);
    const q = String(search || '').trim();
    const isIdQuery = /^\d+$/.test(q);

    if (!q) {
      return [];
    }
    if (!isIdQuery && q.length < 2) {
      return [];
    }

    const params = [ROLE.CLIENT, ROLE.BUSINESS];
    let whereExtra = '';

    if (isIdQuery) {
      params.push(Number(q));
      whereExtra = ` AND u.id = $${params.length}`;
    } else {
      params.push(`%${q}%`);
      const i = params.length;
      whereExtra = ` AND (
        u.email ILIKE $${i}
        OR u.phone ILIKE $${i}
        OR cp.first_name ILIKE $${i}
        OR cp.last_name ILIKE $${i}
        OR TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) ILIKE $${i}
        OR bcp.company_name ILIKE $${i}
        OR bcp.contact_person ILIKE $${i}
      )`;
    }

    params.push(lim);
    const limIdx = params.length;

    const { rows } = await db.query(
      `SELECT u.id, u.email, u.phone, u.role,
              TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) AS person_name,
              bcp.company_name,
              bcp.contact_person
       FROM users u
       LEFT JOIN client_profiles cp ON cp.user_id = u.id
       LEFT JOIN business_client_profiles bcp ON bcp.user_id = u.id
       WHERE u.role IN ($1, $2) ${whereExtra}
       ORDER BY COALESCE(bcp.company_name, cp.last_name, u.email) NULLS LAST
       LIMIT $${limIdx}`,
      params
    );
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      phone: r.phone,
      role: r.role,
      contact_person: r.contact_person || null,
      label:
        r.role === ROLE.BUSINESS
          ? `${r.company_name || 'Компанія'} (${r.email})`
          : `${r.person_name?.trim() || 'Клієнт'} (${r.email})`
    }));
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