import { equipmentService } from '../services/equipment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';
import { ApiError } from '../utils/ApiError.js';

const normalizeRole = (role) =>
  String(role || '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[\s_-]+/g, '');

const isManager = (role) => normalizeRole(role) === normalizeRole('Менеджер');

export const equipmentController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['type']);
    const ownerId = isManager(req.user.role) && req.body.userId != null && req.body.userId !== ''
      ? Number(req.body.userId)
      : req.user.id;
    if (isManager(req.user.role) && req.body.userId != null && req.body.userId !== '') {
      if (!Number.isInteger(ownerId) || ownerId <= 0) {
        throw ApiError.badRequest('Невірний власник техніки');
      }
    }
    const device = await equipmentService.create({
      ...req.body,
      userId: ownerId
    });
    res.status(201).json(device);
  }),

  listByUser: asyncHandler(async (req, res) => {
    const uid = Number(req.params.userId);
    if (!Number.isInteger(uid) || uid <= 0) throw ApiError.badRequest('Невірний ідентифікатор');
    if (!isManager(req.user.role) && uid !== req.user.id) {
      throw ApiError.forbidden('Немає доступу');
    }
    const devices = await equipmentService.listByUser(uid);
    res.json(devices);
  }),

  getById: asyncHandler(async (req, res) => {
    const device = await equipmentService.getById(Number(req.params.id));
    if (!isManager(req.user.role) && Number(device.user_id) !== Number(req.user.id)) {
      throw ApiError.forbidden('Немає доступу');
    }
    res.json(device);
  }),

  getHistory: asyncHandler(async (req, res) => {
    const device = await equipmentService.getById(Number(req.params.id));
    if (!isManager(req.user.role) && Number(device.user_id) !== Number(req.user.id)) {
      throw ApiError.forbidden('Немає доступу');
    }
    const history = await equipmentService.getHistory(Number(req.params.id));
    res.json(history);
  }),

  remove: asyncHandler(async (req, res) => {
    const device = await equipmentService.getById(Number(req.params.id));
    if (!isManager(req.user.role) && Number(device.user_id) !== Number(req.user.id)) {
      throw ApiError.forbidden('Немає доступу');
    }
    await equipmentService.deleteById(Number(req.params.id));
    res.status(204).end();
  }),
};
