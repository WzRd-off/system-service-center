import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class MastersService {
  async getProfileByUserId(userId) {
    const { rows } = await db.query(
      'SELECT * FROM technician_profiles WHERE user_id = $1',
      [userId]
    );
    if (!rows[0]) throw ApiError.notFound('Профіль майстра не знайдено');
    return rows[0];
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
