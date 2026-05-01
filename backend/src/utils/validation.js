export const isEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isPhone = (value) =>
  typeof value === 'string' && /^\+?\d{10,15}$/.test(value.replace(/\s|-/g, ''));

export const isStrongPassword = (value) =>
  typeof value === 'string' && value.length >= 6;

export const requireFields = (body, fields) => {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    throw new Error(`Відсутні обов'язкові поля: ${missing.join(', ')}`);
  }
};
