import { businessClientsService } from '../services/businessClients.service.js';
import { equipmentService } from '../services/equipment.service.js';
import { requestsService } from '../services/requests.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const businessClientsController = {
  getProfile: asyncHandler(async (req, res) => {
    const profile = await businessClientsService.getProfileByUserId(req.user.id);
    res.json(profile);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const profile = await businessClientsService.updateProfile(req.user.id, req.body);
    res.json(profile);
  }),

  getDevices: asyncHandler(async (req, res) => {
    const devices = await equipmentService.listByUser(req.user.id);
    res.json(devices);
  }),

  getRequests: asyncHandler(async (req, res) => {
    const requests = await requestsService.list({ userId: req.user.id });
    res.json(requests);
  }),

  getMaintenancePlans: asyncHandler(async (req, res) => {
    const profile = await businessClientsService.getProfileByUserId(req.user.id);
    const plans = await businessClientsService.listMaintenancePlans(profile.id);
    res.json(plans);
  }),

  createMaintenancePlan: asyncHandler(async (req, res) => {
    const profile = await businessClientsService.getProfileByUserId(req.user.id);
    const plan = await businessClientsService.createMaintenancePlan({
      ...req.body,
      profileId: profile.id
    });
    res.status(201).json(plan);
  }),

  listAll: asyncHandler(async (req, res) => {
    const list = await businessClientsService.listAll();
    res.json(list);
  }),

  getDevicesById: asyncHandler(async (req, res) => {
    const devices = await businessClientsService.listDevices(Number(req.params.id));
    res.json(devices);
  })
};
