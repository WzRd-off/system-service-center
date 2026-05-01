import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields, isEmail, isStrongPassword } from '../utils/validation.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const authController = {
  register: asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password', 'role']);
    const { email, password } = req.body;
    if (!isEmail(email)) throw ApiError.badRequest('Невірна пошта');
    if (!isStrongPassword(password)) throw ApiError.badRequest('Пароль має містити щонайменше 6 символів');

    const user = await authService.register(req.body);
    res.status(201).json(user);
  }),

  login: asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password']);
    const { token, user } = await authService.login(req.body);
    res.cookie('token', token, cookieOptions).json(user);
  }),

  logout: asyncHandler(async (req, res) => {
    res.clearCookie('token').json({ ok: true });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.findById(req.user.id);
    if (!user) throw ApiError.unauthorized();
    res.json(user);
  })
};
