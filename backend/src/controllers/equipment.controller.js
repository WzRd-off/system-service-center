import { equipmentService } from '../services/equipment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';

export const equipmentController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['type']);
    const device = await equipmentService.create(req.body);
    res.status(201).json(device);
  }),

  listByClient: asyncHandler(async (req, res) => {
    const devices = await equipmentService.listByClient(Number(req.params.clientId));
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
