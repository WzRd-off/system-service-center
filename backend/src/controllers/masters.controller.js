import { mastersService } from '../services/masters.service.js';
import { requestsService } from '../services/requests.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';

export const mastersController = {
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
  })
};
