import { ApiError } from '../utils/ApiError.js';

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Маршрут не знайдено: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Внутрішня помилка сервера';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};
