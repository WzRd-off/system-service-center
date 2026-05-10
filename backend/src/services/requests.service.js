import { db } from '../database/db.js';
import { generateRequestNumber } from '../utils/helpers.js';
import { ApiError } from '../utils/ApiError.js';
import { notificationsService } from './notifications.service.js';

const STATUS_TO_NOTIFICATION = {
  accepted: 'request_accepted',
  awaiting_clarification: 'clarification_needed',
  completed: 'repair_completed',
  cancelled: 'request_cancelled'
};

class RequestsService {
  async create({ 
    userId,
    deviceId, 
    type, 
    manufacturer, 
    model, 
    serialNumber, 
    description, 
    address,
    preferredContact, 
    serviceType 
  }) {
    let finalDeviceId = deviceId;

    if (!finalDeviceId && type) {
      const { rows: deviceRows } = await db.query(
        `INSERT INTO devices (user_id, type, manufacturer, model, serial_number)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [userId, type, manufacturer, model, serialNumber]
      );
      finalDeviceId = deviceRows[0].id;
    }

    const requestNumber = generateRequestNumber();
    const { rows } = await db.query(
        `INSERT INTO service_requests
          (request_number, user_id, device_id, description, status, preferred_contact, service_type, service_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          requestNumber, 
          userId, 
          finalDeviceId, 
          description, 
          'new_request', 
          preferredContact, 
          serviceType || null,
          address || null
        ]
      );

    const created = rows[0];
    if (created?.id) {
      await notificationsService.createForRequest(created.id, 'request_created');
    }
    return created;
  }

  async getById(id) {
    const { rows } = await db.query(
      `SELECT sr.*,
              cp.user_id  AS client_user_id,
              bcp.user_id AS business_user_id,
              tp.user_id  AS technician_user_id,
              TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) AS client_name,
              bcp.company_name,
              bcp.contact_person,
              TRIM(CONCAT_WS(' ', tp.first_name, tp.last_name)) AS technician_name,
              d.type AS type, d.manufacturer, d.model, d.serial_number,
              COALESCE(u_cp.phone, u_bc.phone) AS contact_phone,
              COALESCE(u_cp.email, u_bc.email) AS contact_email,
              sr.service_address AS address,
              wr.diagnostic_result, wr.work_description, wr.used_parts
       FROM service_requests sr
       LEFT JOIN client_profiles cp ON cp.user_id = sr.user_id
       LEFT JOIN users u_cp ON u_cp.id = cp.user_id
       LEFT JOIN business_client_profiles bcp ON bcp.user_id = sr.user_id
       LEFT JOIN users u_bc ON u_bc.id = bcp.user_id
       LEFT JOIN technician_profiles tp ON tp.id = sr.assigned_technician_id
       LEFT JOIN devices d ON d.id = sr.device_id
       LEFT JOIN LATERAL (
         SELECT diagnostic_result, work_description, used_parts
         FROM work_reports WHERE request_id = sr.id
         ORDER BY created_at DESC LIMIT 1
       ) wr ON TRUE
       WHERE sr.id = $1`,
      [id]
    );
    if (!rows[0]) throw ApiError.notFound('Request not found');
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

  async list({ limit = 50, offset = 0, status, technicianId, userId, dateFrom, dateTo, client } = {}) {
    const conditions = [];
    const params = [];

    const push = (cond, val) => {
      params.push(val);
      conditions.push(`${cond} $${params.length}`);
    };

    if (status) push('sr.status =', status);
    if (technicianId) push('sr.assigned_technician_id =', technicianId);
    if (userId) push('sr.user_id =', userId);
    if (dateFrom) push('sr.created_at >=', dateFrom);
    if (dateTo) push('sr.created_at <=', `${dateTo} 23:59:59`);
    if (client) {
      params.push(`%${client}%`);
      const idx = params.length;
      conditions.push(
        `(cp.first_name ILIKE $${idx} OR cp.last_name ILIKE $${idx}
          OR u_cp.email ILIKE $${idx} OR u_cp.phone ILIKE $${idx}
          OR bcp.company_name ILIKE $${idx} OR bcp.contact_person ILIKE $${idx}
          OR u_bc.email ILIKE $${idx} OR u_bc.phone ILIKE $${idx})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const { rows } = await db.query(
      `SELECT sr.*,
              TRIM(CONCAT_WS(' ', cp.first_name, cp.last_name)) AS client_name,
              bcp.company_name,
              bcp.contact_person,
              COALESCE(u_cp.phone, u_bc.phone) AS contact_phone,
              COALESCE(u_cp.email, u_bc.email) AS contact_email,
              sr.service_address AS address,
              TRIM(CONCAT_WS(' ', tp.first_name, tp.last_name)) AS technician_name
       FROM service_requests sr
       LEFT JOIN client_profiles cp ON cp.user_id = sr.user_id
       LEFT JOIN users u_cp ON u_cp.id = cp.user_id
       LEFT JOIN business_client_profiles bcp ON bcp.user_id = sr.user_id
       LEFT JOIN users u_bc ON u_bc.id = bcp.user_id
       LEFT JOIN technician_profiles tp ON tp.id = sr.assigned_technician_id  
       ${where}
       ORDER BY sr.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}
       `,
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
    if (!rows[0]) throw ApiError.notFound('Request not found');

    const notificationType = STATUS_TO_NOTIFICATION[status] || 'status_changed';
    await notificationsService.createForRequest(id, notificationType);

    return rows[0];
  }

  async assignTechnician(id, technicianId) {
    const { rows } = await db.query(
      `UPDATE service_requests
       SET assigned_technician_id = $1, status = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [technicianId, 'technician_assigned', id]
    );
    if (!rows[0]) throw ApiError.notFound('Request not found');

    await notificationsService.createForRequest(id, 'technician_assigned');

    return rows[0];
  }
}

export const requestsService = new RequestsService();