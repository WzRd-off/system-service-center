import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class BusinessClientsService {
  async getProfileByUserId(userId) {
    const { rows } = await db.query(
      'SELECT * FROM business_client_profiles WHERE user_id = $1',
      [userId]
    );
    if (rows[0]) return rows[0];

    const { rows: userRows } = await db.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );
    const email = userRows[0]?.email || `user-${userId}`;
    const placeholder = email.split('@')[0] || `Компанія ${userId}`;

    const { rows: created } = await db.query(
      `INSERT INTO business_client_profiles (user_id, company_name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId, placeholder, email]
    );
    if (created[0]) return created[0];

    const { rows: again } = await db.query(
      'SELECT * FROM business_client_profiles WHERE user_id = $1',
      [userId]
    );
    return again[0];
  }

  async updateProfile(userId, data) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Профіль не знайдено');

    const fields = ['company_name', 'edrpou', 'contact_person', 'phone', 'email', 'address'];
    const values = [];
    const sets = [];
    fields.forEach((f) => {
      if (data[f] !== undefined) {
        values.push(data[f]);
        sets.push(`${f} = $${values.length}`);
      }
    });
    if (!sets.length) return profile;
    values.push(profile.id);
    const { rows } = await db.query(
      `UPDATE business_client_profiles SET ${sets.join(', ')}
       WHERE id = $${values.length} RETURNING *`,
      values
    );
    return rows[0];
  }

  async listAll() {
    const { rows } = await db.query(
      `SELECT bcp.*, COUNT(sr.id)::int AS total_requests
       FROM business_client_profiles bcp
       LEFT JOIN service_requests sr ON sr.business_client_id = bcp.id
       GROUP BY bcp.id
       ORDER BY bcp.company_name ASC`
    );
    return rows;
  }

  async listDevices(businessClientId) {
    const { rows } = await db.query(
      `SELECT * FROM devices WHERE business_client_id = $1 ORDER BY created_at DESC`,
      [businessClientId]
    );
    return rows;
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
