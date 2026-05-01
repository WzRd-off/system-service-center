import { db } from '../database/db.js';
import { generateRequestNumber } from '../utils/helpers.js';
import { ApiError } from '../utils/ApiError.js';

class RequestsService {
  async create({ clientId, businessClientId, deviceId, description, preferredContact }) {
    const requestNumber = generateRequestNumber();
    const { rows } = await db.query(
      `INSERT INTO service_requests
         (request_number, client_id, business_client_id, device_id, description, status, preferred_contact)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [requestNumber, clientId, businessClientId, deviceId, description, 'new_request', preferredContact]
    );
    return rows[0];
  }

  async getById(id) {
    const { rows } = await db.query('SELECT * FROM service_requests WHERE id = $1', [id]);
    if (!rows[0]) throw ApiError.notFound('Заявку не знайдено');
    return rows[0];
  }

  async list({ limit = 50, offset = 0, status, technicianId, clientId, businessClientId } = {}) {
    const conditions = [];
    const params = [];
    const push = (cond, val) => {
      params.push(val);
      conditions.push(`${cond} $${params.length}`);
    };

    if (status) push('status =', status);
    if (technicianId) push('assigned_technician_id =', technicianId);
    if (clientId) push('client_id =', clientId);
    if (businessClientId) push('business_client_id =', businessClientId);

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const { rows } = await db.query(
      `SELECT * FROM service_requests ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    return rows;
  }

  async updateStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE service_requests SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (!rows[0]) throw ApiError.notFound('Заявку не знайдено');
    return rows[0];
  }

  async assignTechnician(id, technicianId) {
    const { rows } = await db.query(
      `UPDATE service_requests
       SET assigned_technician_id = $1, status = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [technicianId, 'technician_assigned', id]
    );
    if (!rows[0]) throw ApiError.notFound('Заявку не знайдено');
    return rows[0];
  }
}

export const requestsService = new RequestsService();
