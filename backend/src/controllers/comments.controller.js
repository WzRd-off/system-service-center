import { commentsService } from '../services/comments.service.js';
import { requestsService } from '../services/requests.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';
import {
  assertCanAccessRequest,
  getTechnicianProfileIdByUserId,
} from '../services/requestAccess.service.js';

const normalizeRole = (role) =>
  String(role || '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[\s_-]+/g, '');

export const commentsController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['requestId', 'text']);
    const requestId = Number(req.body.requestId);
    const request = await requestsService.getById(requestId, { includeStatusHistory: false });
    const techId =
      normalizeRole(req.user.role) === normalizeRole('Майстер')
        ? await getTechnicianProfileIdByUserId(req.user.id)
        : null;
    assertCanAccessRequest(request, req.user, techId);

    const comment = await commentsService.create({
      ...req.body,
      authorId: req.user.id,
      authorRole: req.user.role
    });
    res.status(201).json(comment);
  }),

  listByRequest: asyncHandler(async (req, res) => {
    const requestId = Number(req.params.requestId);
    const request = await requestsService.getById(requestId, { includeStatusHistory: false });
    const techId =
      normalizeRole(req.user.role) === normalizeRole('Майстер')
        ? await getTechnicianProfileIdByUserId(req.user.id)
        : null;
    assertCanAccessRequest(request, req.user, techId);

    const comments = await commentsService.listByRequest(requestId);
    res.json(comments);
  }),

  update: asyncHandler(async (req, res) => {
    requireFields(req.body, ['text']);
    const comment = await commentsService.update(Number(req.params.id), req.user.id, req.body.text);
    res.json(comment);
  })
};
