import { requestsService } from '../services/requests.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';
import { ApiError } from '../utils/ApiError.js';
import {
  assertCanAccessRequest,
  assertTargetUserIsClientOrBusiness,
  getTechnicianProfileIdByUserId,
} from '../services/requestAccess.service.js';

const normalizeRole = (role) =>
  String(role || '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[\s_-]+/g, '');

const isManagerRole = (role) => normalizeRole(role) === normalizeRole('Менеджер');

export const requestsController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['description']);
    let userId = req.user.id;
    if (isManagerRole(req.user.role) && req.body.userId != null && req.body.userId !== '') {
      userId = Number(req.body.userId);
      if (!Number.isInteger(userId) || userId <= 0) {
        throw ApiError.badRequest('Невірний клієнт');
      }
      await assertTargetUserIsClientOrBusiness(userId);
    }

    const request = await requestsService.create({
      ...req.body,
      userId,
      createdByUserId: req.user.id,
    });
    res.status(201).json(request);
  }),

  list: asyncHandler(async (req, res) => {
    const { status, technicianId, limit, offset, dateFrom, dateTo, client, clientUserId } = req.query;
    const isManager = isManagerRole(req.user?.role);

    let userIdFilter = isManager ? undefined : req.user.id;
    if (isManager && clientUserId != null && clientUserId !== '') {
      const cid = Number(clientUserId);
      if (Number.isInteger(cid) && cid > 0) {
        userIdFilter = cid;
      }
    }

    const requests = await requestsService.list({
      status,
      technicianId: technicianId && Number(technicianId),
      userId: userIdFilter,
      dateFrom,
      dateTo,
      client,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    });
    res.json(requests);
  }),

  getById: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const request = await requestsService.getById(id);
    const techId =
      normalizeRole(req.user.role) === normalizeRole('Майстер')
        ? await getTechnicianProfileIdByUserId(req.user.id)
        : null;
    assertCanAccessRequest(request, req.user, techId);
    res.json(request);
  }),

  updateDetails: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await requestsService.updateDetails(id, req.body);
    const request = await requestsService.getById(id);
    res.json(request);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);
    const request = await requestsService.updateStatus(
      Number(req.params.id),
      req.body.status,
      { changedByUserId: req.user.id }
    );
    res.json(request);
  }),

  assignTechnician: asyncHandler(async (req, res) => {
    requireFields(req.body, ['technicianId']);
    const request = await requestsService.assignTechnician(
      Number(req.params.id),
      Number(req.body.technicianId),
      { changedByUserId: req.user.id }
    );
    res.json(request);
  }),
};
