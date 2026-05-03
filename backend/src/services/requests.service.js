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
    const { rows } = await db.query(
      `SELECT sr.*,
              cp.user_id  AS client_user_id,
              bcp.user_id AS business_user_id,
              tp.user_id  AS technician_user_id,
              TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) AS client_name,
              bcp.company_name,
              TRIM(CONCAT_WS(' ', tp.first_name, tp.last_name)) AS technician_name,
              d.type AS type, d.manufacturer, d.model, d.serial_number,
              wr.diagnostic_result, wr.work_description, wr.used_parts
       FROM service_requests sr
       LEFT JOIN client_profiles cp           ON cp.id = sr.client_id
       LEFT JOIN business_client_profiles bcp ON bcp.id = sr.business_client_id
       LEFT JOIN technician_profiles tp       ON tp.id = sr.assigned_technician_id
       LEFT JOIN devices d                    ON d.id = sr.device_id
       LEFT JOIN LATERAL (
         SELECT diagnostic_result, work_description, used_parts
         FROM work_reports WHERE request_id = sr.id
         ORDER BY created_at DESC LIMIT 1
       ) wr ON TRUE
       WHERE sr.id = $1`,
      [id]
    );
    if (!rows[0]) throw ApiError.notFound('Заявку не знайдено');
    const r = rows[0];
    if (r.diagnostic_result || r.work_description || r.used_parts) {
      r.work_report = {
        diagnostic_result: r.diagnostic_result,
        work_description: r.work_description,
        used_parts: r.used_parts,
      };
    }
    return r;
  }

  async list({
    limit = 50,
    offset = 0,
    status,
    technicianId,
    clientId,
    businessClientId,
    dateFrom,
    dateTo,
    client,
  } = {}) {
    const conditions = [];
    const params = [];
    const push = (cond, val) => {
      params.push(val);
      conditions.push(`${cond} $${params.length}`);
    };

    if (status) push('sr.status =', status);
    if (technicianId) push('sr.assigned_technician_id =', technicianId);
    if (clientId) push('sr.client_id =', clientId);
    if (businessClientId) push('sr.business_client_id =', businessClientId);
    if (dateFrom) push('sr.created_at >=', dateFrom);
    if (dateTo) push('sr.created_at <=', `${dateTo} 23:59:59`);

    if (client) {
      params.push(`%${client}%`);
      const idx = params.length;
      conditions.push(
        `(cp.first_name ILIKE $${idx} OR cp.last_name ILIKE $${idx}
          OR cp.email ILIKE $${idx} OR cp.phone ILIKE $${idx}
          OR bcp.company_name ILIKE $${idx} OR bcp.contact_person ILIKE $${idx})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const { rows } = await db.query(
      `SELECT sr.*,
              TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) AS client_name,
              bcp.company_name,
              TRIM(CONCAT_WS(' ', tp.first_name, tp.last_name)) AS technician_name
       FROM service_requests sr
       LEFT JOIN client_profiles cp           ON cp.id = sr.client_id
       LEFT JOIN business_client_profiles bcp ON bcp.id = sr.business_client_id
       LEFT JOIN technician_profiles tp       ON tp.id = sr.assigned_technician_id
       ${where}
       ORDER BY sr.created_at DESC
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
