import { commentsService } from '../services/comments.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validation.js';

export const commentsController = {
  create: asyncHandler(async (req, res) => {
    requireFields(req.body, ['requestId', 'text']);
    const comment = await commentsService.create({
      ...req.body,
      authorId: req.user.id,
      authorRole: req.user.role
    });
    res.status(201).json(comment);
  }),

  listByRequest: asyncHandler(async (req, res) => {
    const comments = await commentsService.listByRequest(Number(req.params.requestId));
    res.json(comments);
  }),

  update: asyncHandler(async (req, res) => {
    requireFields(req.body, ['text']);
    const comment = await commentsService.update(Number(req.params.id), req.user.id, req.body.text);
    res.json(comment);
  })
};
