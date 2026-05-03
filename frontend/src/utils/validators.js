export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v) => /^\+?\d{10,15}$/.test((v || '').replace(/\s|-/g, ''));
export const isStrongPassword = (v) => typeof v === 'string' && v.length >= 6;
