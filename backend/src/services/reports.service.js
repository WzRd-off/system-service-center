import { db } from '../database/db.js';

class ReportsService {
  async requestsByStatus() {
    const { rows } = await db.query(
      `SELECT status, COUNT(*)::int AS count
       FROM service_requests
       GROUP BY status`
    );
    return rows;
  }

  async technicianActivity() {
    const { rows } = await db.query(
      `SELECT tp.id, tp.first_name, tp.last_name,
              COUNT(sr.id)::int AS total_requests,
              SUM(CASE WHEN sr.status IN ('completed','delivered') THEN 1 ELSE 0 END)::int AS completed
       FROM technician_profiles tp
       LEFT JOIN service_requests sr ON sr.assigned_technician_id = tp.id
       GROUP BY tp.id`
    );
    return rows;
  }

  async businessClientActivity() {
    const { rows } = await db.query(
      `SELECT bcp.id, bcp.company_name, COUNT(sr.id)::int AS total_requests
       FROM business_client_profiles bcp
       LEFT JOIN service_requests sr ON sr.user_id = bcp.user_id
       GROUP BY bcp.id`
    );
    return rows;
  }
}

export const reportsService = new ReportsService();