import { usersService } from '../services/users.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const usersController = {
  getProfile: asyncHandler(async (req, res) => {
    const user = await usersService.getProfile(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await usersService.updateProfile(req.user.id, req.body);
    res.json(user);
  })
};
