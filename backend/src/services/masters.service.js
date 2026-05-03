import { db } from '../database/db.js';

class MastersService {
  async getProfileByUserId(userId) {
    const { rows } = await db.query(
      'SELECT * FROM technician_profiles WHERE user_id = $1',
      [userId]
    );
    if (rows[0]) return rows[0];

    const { rows: created } = await db.query(
      `INSERT INTO technician_profiles (user_id, email)
       SELECT id, email FROM users WHERE id = $1
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
      `SELECT tp.id, tp.first_name, tp.last_name, tp.phone, tp.email, tp.specialty
       FROM technician_profiles tp
       ORDER BY tp.last_name NULLS LAST, tp.first_name NULLS LAST`
    );
    return rows;
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
