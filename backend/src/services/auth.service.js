import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

class AuthService {
  async register({ email, phone, password, role }) {
    const roleCheck = await db.query('SELECT 1 FROM roles WHERE code = $1', [role]);
    if (roleCheck.rowCount === 0) {
      throw ApiError.badRequest('Невірна роль');
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      throw ApiError.conflict('Користувач з такою поштою вже існує');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await db.query(
      `INSERT INTO users (email, phone, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, phone, role, created_at`,
      [email, phone, hash, role]
    );
    return rows[0];
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
}

export const authService = new AuthService();
