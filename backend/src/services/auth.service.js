import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, pool } from '../database/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

const ROLE = {
  CLIENT: 'Клієнт',
  MANAGER: 'Менеджер',
  TECHNICIAN: 'Майстер',
  BUSINESS: 'Бізнес-клієнт',
};

class AuthService {
  async register({ email, phone, password, role, companyName, edrpou, contact_person, address, firstName, lastName }) {
    const roleCheck = await db.query('SELECT 1 FROM roles WHERE code = $1', [role]);
    if (roleCheck.rowCount === 0) {
      throw ApiError.badRequest('Невірна роль');
    }

    if (role === ROLE.BUSINESS && !companyName?.trim()) {
      throw ApiError.badRequest('Для бізнес-клієнта потрібна назва компанії');
    }

    if (role === ROLE.BUSINESS && !edrpou?.trim()) {
      throw ApiError.badRequest('Для бізнес-клієнта потрібен ЕДРПОУ');
    }

    if (role === ROLE.BUSINESS && !contact_person?.trim()) {
      throw ApiError.badRequest('Для бізнес-клієнта потрібна контактна особа');
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      throw ApiError.conflict('Користувач з такою поштою вже існує');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const create_user = await pool.connect();
    try {
      await create_user.query('BEGIN');

      const { rows: userRows } = await create_user.query(
        `INSERT INTO users (email, phone, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, phone, role, created_at`,
        [email, phone, hash, role]
      );
      const user = userRows[0];

      await this._createProfile(create_user, user, { companyName, edrpou, contact_person, address, firstName, lastName, phone });

      await create_user.query('COMMIT');
      return user;
    } catch (err) {
      await create_user.query('ROLLBACK');
      throw err;
    } finally {
      create_user.release();
    }
  }

  async _createProfile(create_user, user, { companyName, edrpou, contact_person, address, firstName, lastName, phone }) {
    switch (user.role) {
      case ROLE.CLIENT:
        await create_user.query(
          `INSERT INTO client_profiles (user_id, first_name, last_name, phone, email, address)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id, firstName || null, lastName || null, phone || null, user.email, address || null]
        );
        return;
      case ROLE.TECHNICIAN:
        await create_user.query(
          `INSERT INTO technician_profiles (user_id, first_name, last_name, phone, email, address)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id, firstName || null, lastName || null, phone || null, user.email, address || null]
        );
        return;
      case ROLE.BUSINESS:
        await create_user.query(
          `INSERT INTO business_client_profiles (user_id, company_name, edrpou, phone, email, address)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id, companyName, edrpou, phone || null, user.email, address || null]
        );
        return;
      default:
        return;
    }
  }

  async login({ email, password }) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw ApiError.unauthorized('Невірна пошта або пароль');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiry }
    );

    return {
      token,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role }
    };
  }

  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, email, phone, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  }

  async changePassword({ userId, currentPassword, newPassword }) {
    const { rows } = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    const row = rows[0];
    if (!row) throw ApiError.unauthorized();

    const ok = await bcrypt.compare(currentPassword, row.password);
    if (!ok) throw ApiError.badRequest('Невірний поточний пароль');

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [
      hash,
      userId,
    ]);
    return { ok: true };
  }
}

export const authService = new AuthService();
