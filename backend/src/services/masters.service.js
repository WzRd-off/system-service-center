import { db, pool } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class MastersService {
  async getProfileByUserId(userId) {
    const { rows } = await db.query(
      'SELECT * FROM technician_profiles WHERE user_id = $1',
      [userId]
    );
    if (rows[0]) return rows[0];

    const { rows: created } = await db.query(
      `INSERT INTO technician_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId]
    );
    if (created[0]) return created[0];

    const { rows: again } = await db.query(
      'SELECT * FROM technician_profiles WHERE user_id = $1',
      [userId]
    );
    return again[0];
  }

  async listAll() {
    const { rows } = await db.query(
      `SELECT tp.id, tp.user_id, tp.first_name, tp.last_name, tp.specialty,
              u.phone, u.email, u.created_at
       FROM technician_profiles tp
       JOIN users u ON u.id = tp.user_id
       ORDER BY tp.last_name NULLS LAST, tp.first_name NULLS LAST`
    );
    return rows;
  }

  async remove(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        'SELECT user_id FROM technician_profiles WHERE id = $1',
        [id]
      );
      const profile = rows[0];
      if (!profile) throw ApiError.notFound('Майстра не знайдено');

      const { rows: linked } = await client.query(
        `SELECT
           (SELECT COUNT(*) FROM service_requests WHERE assigned_technician_id = $1)::int AS requests,
           (SELECT COUNT(*) FROM work_reports     WHERE technician_id = $1)::int AS reports`,
        [id]
      );
      if (linked[0].requests > 0 || linked[0].reports > 0) {
        throw ApiError.conflict('Неможливо видалити: майстер має призначені заявки або звіти');
      }

      await client.query('DELETE FROM technician_profiles WHERE id = $1', [id]);
      await client.query('DELETE FROM users WHERE id = $1', [profile.user_id]);
      await client.query('COMMIT');
      return { ok: true };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async listAssignedRequests(technicianId) {
    const { rows } = await db.query(
      `SELECT * FROM service_requests
       WHERE assigned_technician_id = $1
       ORDER BY created_at DESC`,
      [technicianId]
    );
    return rows;
  }

  async addWorkReport({ requestId, technicianId, diagnosticResult, workDescription, usedParts }) {
    const { rows } = await db.query(
      `INSERT INTO work_reports (request_id, technician_id, diagnostic_result, work_description, used_parts)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [requestId, technicianId, diagnosticResult, workDescription, usedParts]
    );
    return rows[0];
  }
}

export const mastersService = new MastersService();
