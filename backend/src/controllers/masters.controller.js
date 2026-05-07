import { mastersService } from '../services/masters.service.js';
import { requestsService } from '../services/requests.service.js';
import { notificationsService } from '../services/notifications.service.js';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields, isEmail, isStrongPassword } from '../utils/validation.js';
import { ApiError } from '../utils/ApiError.js';

const TECHNICIAN_ROLE = 'Майстер';

export const mastersController = {
  list: asyncHandler(async (req, res) => {
    const list = await mastersService.listAll();
    res.json(list);
  }),

  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password']);
    const { email, password } = req.body;
    if (!isEmail(email)) throw ApiError.badRequest('Невірна пошта');
    if (!isStrongPassword(password)) throw ApiError.badRequest('Пароль має містити щонайменше 6 символів');

    const user = await authService.register({ ...req.body, role: TECHNICIAN_ROLE });
    res.status(201).json(user);
  }),

  remove: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw ApiError.badRequest('Невірний ідентифікатор');
    const result = await mastersService.remove(id);
    res.json(result);
  }),

  getAssignedRequests: asyncHandler(async (req, res) => {
    const profile = await mastersService.getProfileByUserId(req.user.id);
    const requests = await mastersService.listAssignedRequests(profile.id);
    res.json(requests);
  }),

  updateRequestStatus: asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);
    const request = await requestsService.updateStatus(Number(req.params.id), req.body.status);
    res.json(request);
  }),

  addWorkReport: asyncHandler(async (req, res) => {
    requireFields(req.body, ['requestId']);
    const profile = await mastersService.getProfileByUserId(req.user.id);
    const report = await mastersService.addWorkReport({
      ...req.body,
      technicianId: profile.id
    });
    res.status(201).json(report);
  }),

  notifyCompletion: asyncHandler(async (req, res) => {
    const requestId = Number(req.params.id);
    const request = await requestsService.getById(requestId);
    if (!request) throw ApiError.notFound('Заявку не знайдено');

    await notificationsService.create({
      userId: request.client_user_id || request.business_user_id || req.user.id,
      requestId,
      type: 'repair_completed',
      message: `Майстер повідомив про завершення робіт по заявці №${request.request_number}`
    });
    res.json({ ok: true });
  })
};
