export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v) => /^\+?\d{10,15}$/.test((v || '').replace(/\s|-/g, ''));
export const isStrongPassword = (v) => typeof v === 'string' && v.length >= 6;

export const INPUT_LIMITS = {
  phone: 20,
  email: 255,
  password: 255,
  personName: 100,
  companyName: 255,
  edrpou: 20,
  shortText: 100,
  specialty: 255,
  serialNumber: 100,
};

export const sanitizeDigits = (value, max = INPUT_LIMITS.phone) =>
  String(value || '').replace(/\D/g, '').slice(0, max);

export const sanitizeEmail = (value, max = INPUT_LIMITS.email) =>
  String(value || '').replace(/\s/g, '').slice(0, max);

export const sanitizePassword = (value, max = INPUT_LIMITS.password) =>
  String(value || '').slice(0, max);

export const sanitizePersonName = (value, max = INPUT_LIMITS.personName) =>
  String(value || '')
    .replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]/g, '')
    .slice(0, max);

export const sanitizeSimpleText = (value, max = INPUT_LIMITS.shortText) =>
  String(value || '')
    .replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9 .,'"_\-()/#]/g, '')
    .slice(0, max);

export const sanitizeAddress = (value, max) =>
  String(value || '')
    .replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9 .,'"_\-()/#:]/g, '')
    .slice(0, typeof max === 'number' ? max : undefined);

export const sanitizeSerial = (value, max = INPUT_LIMITS.serialNumber) =>
  String(value || '')
    .replace(/[^a-zA-Z0-9._\-/]/g, '')
    .slice(0, max);

export const sanitizeLongText = (value, max) =>
  String(value || '').slice(0, typeof max === 'number' ? max : undefined);
