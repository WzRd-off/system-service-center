import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class BusinessClientsService {
  async _getProfileWithContacts(userId) {
    const { rows } = await db.query(
      `SELECT bcp.*, u.phone, u.email
       FROM business_client_profiles bcp
       JOIN users u ON u.id = bcp.user_id
       WHERE bcp.user_id = $1`,
      [userId]
    );
    return rows[0];
  }

  async getProfileByUserId(userId) {
    const existing = await this._getProfileWithContacts(userId);
    if (existing) return existing;

    const { rows: userRows } = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = userRows[0]?.email || `user-${userId}`;
    const placeholder = email.split('@')[0] || `Client ${userId}`;

    const { rows: created } = await db.query(
      `INSERT INTO business_client_profiles (user_id, company_name)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId, placeholder]
    );
    if (created[0]) return await this._getProfileWithContacts(userId);

    return await this._getProfileWithContacts(userId);
  }

  async updateProfile(userId, data) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Profile not found');

    const fields = ['company_name', 'edrpou', 'contact_person', 'address'];
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

    await db.query(
      `UPDATE business_client_profiles SET ${sets.join(', ')}
       WHERE id = $${values.length} RETURNING *`,
      values
    );
    return await this.getProfileByUserId(userId);
  }

  async listAll() {
    const { rows } = await db.query(
      `SELECT bcp.*,
              u.phone,
              u.email,
              (
                SELECT COUNT(*)::int
                FROM service_requests sr
                WHERE sr.user_id = bcp.user_id
              ) AS total_requests
       FROM business_client_profiles bcp
       JOIN users u ON u.id = bcp.user_id
       ORDER BY bcp.company_name ASC`
    );
    return rows;
  }

  async listDevices(profileId) {
    const { rows } = await db.query(
      `SELECT d.*
       FROM devices d
       JOIN business_client_profiles bcp ON bcp.user_id = d.user_id
       WHERE bcp.id = $1
       ORDER BY d.created_at DESC`,
      [profileId]
    );
    return rows;
  }

  async listMaintenancePlans(profileId) {
    const { rows } = await db.query(
      `SELECT mp.*, d.type as device_type, d.model as device_model
       FROM maintenance_plans mp
       LEFT JOIN devices d ON d.id = mp.device_id
       WHERE mp.business_client_id = $1
       ORDER BY mp.schedule_date ASC`,
      [profileId]
    );
    return rows;
  }

  async createMaintenancePlan({ profileId, deviceId, type, scheduleDate, notes }) {
    const { rows } = await db.query(
      `INSERT INTO maintenance_plans (business_client_id, device_id, type, schedule_date, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [profileId, deviceId, type, scheduleDate, notes]
    );
    return rows[0];
  }
}

export const businessClientsService = new BusinessClientsService();