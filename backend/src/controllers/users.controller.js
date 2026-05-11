import { usersService } from '../services/users.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const usersController = {
  listOrderableClients: asyncHandler(async (req, res) => {
    const list = await usersService.listOrderableClients({
      search: req.query.search,
      limit: req.query.limit ? Number(req.query.limit) : undefined
    });
    res.json(list);
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await usersService.getProfile(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await usersService.updateProfile(req.user.id, req.body);
    res.json(user);
  })
};
