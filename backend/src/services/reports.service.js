import { db } from '../database/db.js';

function pushDateFilters(params, conditions, alias, dateFrom, dateTo) {
  if (dateFrom) {
    params.push(dateFrom);
    conditions.push(`${alias}.created_at >= $${params.length}`);
  }
  if (dateTo) {
    params.push(`${dateTo} 23:59:59`);
    conditions.push(`${alias}.created_at <= $${params.length}`);
  }
}

class ReportsService {
  async requestsByStatus({ dateFrom, dateTo } = {}) {
    const params = [];
    const conditions = [];
    pushDateFilters(params, conditions, 'service_requests', dateFrom, dateTo);
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await db.query(
      `SELECT status, COUNT(*)::int AS count
       FROM service_requests
       ${where}
       GROUP BY status`,
      params
    );
    return rows;
  }

  async technicianActivity({ dateFrom, dateTo } = {}) {
    const joinConds = ['sr.assigned_technician_id = tp.id'];
    const params = [];
    if (dateFrom || dateTo) {
      pushDateFilters(params, joinConds, 'sr', dateFrom, dateTo);
    }
    const onClause = joinConds.join(' AND ');
    const { rows } = await db.query(
      `SELECT tp.id, tp.first_name, tp.last_name,
              COUNT(sr.id)::int AS total_requests,
              SUM(CASE WHEN sr.status IN ('completed','delivered') THEN 1 ELSE 0 END)::int AS completed
       FROM technician_profiles tp
       LEFT JOIN service_requests sr ON ${onClause}
       GROUP BY tp.id`,
      params
    );
    return rows;
  }

  async businessClientActivity({ dateFrom, dateTo } = {}) {
    const joinConds = ['sr.user_id = bcp.user_id'];
    const params = [];
    if (dateFrom || dateTo) {
      pushDateFilters(params, joinConds, 'sr', dateFrom, dateTo);
    }
    const onClause = joinConds.join(' AND ');
    const { rows } = await db.query(
      `SELECT bcp.id, bcp.company_name, COUNT(sr.id)::int AS total_requests
       FROM business_client_profiles bcp
       LEFT JOIN service_requests sr ON ${onClause}
       GROUP BY bcp.id`,
      params
    );
    return rows;
  }

  /** Поточне навантаження: заявки не в термінальних статусах */
  async technicianWorkload() {
    const { rows } = await db.query(
      `SELECT tp.id, tp.first_name, tp.last_name,
              COUNT(sr.id) FILTER (
                WHERE sr.status IS NOT NULL
                  AND sr.status NOT IN ('completed', 'delivered', 'cancelled')
              )::int AS active_count,
              COUNT(sr.id) FILTER (WHERE sr.id IS NOT NULL)::int AS total_assigned
       FROM technician_profiles tp
       LEFT JOIN service_requests sr ON sr.assigned_technician_id = tp.id
       GROUP BY tp.id
       ORDER BY active_count DESC, tp.id`
    );
    return rows;
  }
}

export const reportsService = new ReportsService();
