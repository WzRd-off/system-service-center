import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(ApiError.unauthorized('Токену немає'));
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.clearCookie('token');
    next(ApiError.unauthorized('Некоректний токен'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden());
  }
  next();
};

export const clientMiddleware = requireRole('Клієнт');
export const managerMiddleware = requireRole('Менеджер');
export const masterMiddleware = requireRole('Майстер');
export const businessMiddleware = requireRole('Бізнес-клієнт');
