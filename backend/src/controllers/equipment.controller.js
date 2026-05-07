import { equipmentService } from '../services/equipment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';

export const equipmentController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['type']);
    const device = await equipmentService.create({
      ...req.body,
      userId: req.body.userId || req.user.id,
    });
    res.status(201).json(device);
  }),

  listByUser: asyncHandler(async (req, res) => {
    const devices = await equipmentService.listByUser(req.user.id);
    res.json(devices);
  }),

  getById: asyncHandler(async (req, res) => {
    const device = await equipmentService.getById(Number(req.params.id));
    res.json(device);
  }),

  getHistory: asyncHandler(async (req, res) => {
    const history = await equipmentService.getHistory(Number(req.params.id));
    res.json(history);
  })
};
