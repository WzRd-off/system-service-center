import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

export const ROLE_MANAGER = 'Менеджер';
export const ROLE_CLIENT = 'Клієнт';
export const ROLE_BUSINESS = 'Бізнес-клієнт';
export const ROLE_TECHNICIAN = 'Майстер';

const ORDERABLE_ROLES = new Set([ROLE_CLIENT, ROLE_BUSINESS]);

export async function getTechnicianProfileIdByUserId(userId) {
  const { rows } = await db.query(
    'SELECT id FROM technician_profiles WHERE user_id = $1',
    [userId]
  );
  return rows[0]?.id ?? null;
}

export function assertCanAccessRequest(row, user, technicianProfileId) {
  if (!row) throw ApiError.notFound('Request not found');
  const role = user.role;
  if (role === ROLE_MANAGER) return;
  if (role === ROLE_CLIENT || role === ROLE_BUSINESS) {
    if (Number(row.user_id) !== Number(user.id)) {
      throw ApiError.forbidden('Немає доступу до цієї заявки');
    }
    return;
  }
  if (role === ROLE_TECHNICIAN) {
    if (!technicianProfileId || Number(row.assigned_technician_id) !== Number(technicianProfileId)) {
      throw ApiError.forbidden('Немає доступу до цієї заявки');
    }
    return;
  }
  throw ApiError.forbidden('Немає доступу');
}

export async function assertTargetUserIsClientOrBusiness(userId) {
  const { rows } = await db.query('SELECT id, role FROM users WHERE id = $1', [userId]);
  if (!rows[0]) throw ApiError.badRequest('Користувача не знайдено');
  if (!ORDERABLE_ROLES.has(rows[0].role)) {
    throw ApiError.badRequest('Заявку можна створити лише для клієнта або бізнес-клієнта');
  }
}
