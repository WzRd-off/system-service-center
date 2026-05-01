import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class BusinessClientsService {
  async getProfileByUserId(userId) {
    const { rows } = await db.query(
      'SELECT * FROM business_client_profiles WHERE user_id = $1',
      [userId]
    );
    if (!rows[0]) throw ApiError.notFound('Профіль не знайдено');
    return rows[0];
  }

  async listMaintenancePlans(businessClientId) {
    const { rows } = await db.query(
      `SELECT mp.*, d.type as device_type, d.model as device_model
       FROM maintenance_plans mp
       LEFT JOIN devices d ON d.id = mp.device_id
       WHERE mp.business_client_id = $1
       ORDER BY mp.schedule_date ASC`,
      [businessClientId]
    );
    return rows;
  }

  async createMaintenancePlan({ businessClientId, deviceId, type, scheduleDate, notes }) {
    const { rows } = await db.query(
      `INSERT INTO maintenance_plans (business_client_id, device_id, type, schedule_date, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [businessClientId, deviceId, type, scheduleDate, notes]
    );
    return rows[0];
  }
}

export const businessClientsService = new BusinessClientsService();
