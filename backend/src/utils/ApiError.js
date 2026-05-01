export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static badRequest(message = 'Невірний запит') {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Не авторизовано') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Недостатньо прав') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Не знайдено') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Конфлікт') {
    return new ApiError(409, message);
  }
}
