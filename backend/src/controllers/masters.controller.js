import { mastersService } from '../services/masters.service.js';
import { requestsService } from '../services/requests.service.js';
import { notificationsService } from '../services/notifications.service.js';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields, isEmail, isStrongPassword } from '../utils/validation.js';
import { ApiError } from '../utils/ApiError.js';
import {
  assertCanAccessRequest,
  getTechnicianProfileIdByUserId,
} from '../services/requestAccess.service.js';

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
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const rawStatus = req.query.status;
    const status =
      rawStatus != null &&
      String(rawStatus).trim() !== '' &&
      String(rawStatus).trim() !== 'all'
        ? String(rawStatus).trim()
        : undefined;
    const result = await mastersService.listAssignedRequests(profile.id, { limit, offset, status });
    res.json(result);
  }),

  updateRequestStatus: asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);
    const id = Number(req.params.id);
    const profile = await mastersService.getProfileByUserId(req.user.id);
    const request = await requestsService.getById(id, { includeStatusHistory: false });
    assertCanAccessRequest(request, req.user, profile.id);

    const updated = await requestsService.updateStatus(id, req.body.status, {
      changedByUserId: req.user.id
    });
    res.json(updated);
  }),

  addWorkReport: asyncHandler(async (req, res) => {
    requireFields(req.body, ['requestId']);
    const requestId = Number(req.body.requestId);
    const profile = await mastersService.getProfileByUserId(req.user.id);
    const request = await requestsService.getById(requestId, { includeStatusHistory: false });
    assertCanAccessRequest(request, req.user, profile.id);

    const report = await mastersService.addWorkReport({
      ...req.body,
      technicianId: profile.id
    });
    res.status(201).json(report);
  }),

  notifyCompletion: asyncHandler(async (req, res) => {
    const requestId = Number(req.params.id);
    const profile = await mastersService.getProfileByUserId(req.user.id);
    const request = await requestsService.getById(requestId, { includeStatusHistory: false });
    assertCanAccessRequest(request, req.user, profile.id);

    await notificationsService.notifyManagersForRequest(requestId, 'repair_completed');
    res.json({ ok: true });
  })
};
