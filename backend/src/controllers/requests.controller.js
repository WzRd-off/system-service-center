import { requestsService } from '../services/requests.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';

export const requestsController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['description']);    
    const request = await requestsService.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(request);
  }),

  list: asyncHandler(async (req, res) => {
    const { status, technicianId, userId, limit, offset } = req.query;
    const requests = await requestsService.list({
      status,
      technicianId: technicianId && Number(technicianId),
      userId: userId && Number(userId),
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    });
    res.json(requests);
  }),

  getById: asyncHandler(async (req, res) => {
    const request = await requestsService.getById(Number(req.params.id));
    res.json(request);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);
    const request = await requestsService.updateStatus(Number(req.params.id), req.body.status);
    res.json(request);
  }),

  assignTechnician: asyncHandler(async (req, res) => {
    requireFields(req.body, ['technicianId']);
    const request = await requestsService.assignTechnician(
      Number(req.params.id),
      Number(req.body.technicianId)
    );
    res.json(request);
  })
};
