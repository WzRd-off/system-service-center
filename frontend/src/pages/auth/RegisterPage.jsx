import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';
import {
  INPUT_LIMITS,
  sanitizeAddress,
  sanitizeDigits,
  sanitizeEmail,
  sanitizePassword,
  sanitizePersonName,
  sanitizeSimpleText,
} from '../../utils/validators.js';

const roleOptions = [
  { value: ROLES.CLIENT, label: 'Клієнт' },
  { value: ROLES.BUSINESS_CLIENT, label: 'Бізнес-клієнт' }
];

const INITIAL = {
  email: '',
  phone: '',
  password: '',
  role: ROLES.CLIENT,
  firstName: '',
  lastName: '',
  companyName: '',
  edrpou: '',
  address: '',
  contact_person: ''
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isBusiness = form.role === ROLES.BUSINESS_CLIENT;

  const change = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'email') nextValue = sanitizeEmail(value);
    if (name === 'phone') nextValue = sanitizeDigits(value);
    if (name === 'password') nextValue = sanitizePassword(value);
    if (name === 'edrpou') nextValue = sanitizeDigits(value, INPUT_LIMITS.edrpou);
    if (['firstName', 'lastName', 'contact_person'].includes(name)) nextValue = sanitizePersonName(value);
    if (name === 'address') nextValue = sanitizeAddress(value);
    if (name === 'companyName') nextValue = sanitizeSimpleText(value, INPUT_LIMITS.companyName);
    setForm((f) => ({ ...f, [name]: nextValue }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isBusiness && !form.companyName.trim()) {
      setError('Вкажіть назву компанії');
      return;
    }
    if (isBusiness && !form.edrpou.trim()) {
      setError('Вкажіть ЄДРПОУ');
      return;
    }
    if (isBusiness && !form.contact_person.trim()) {
      setError('Вкажіть контактну особу');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = isBusiness
        ? { email: form.email, phone: form.phone, password: form.password, role: form.role, companyName: form.companyName, edrpou: form.edrpou, address: form.address, contact_person: form.contact_person }
        : { email: form.email, phone: form.phone, password: form.password, role: form.role, firstName: form.firstName, lastName: form.lastName, address: form.address };
      await register(payload);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="canvas-card canvas-card--auth auth-page">
        <h2>Реєстрація</h2>
        <form onSubmit={submit}>
          <Select label="Роль" name="role" value={form.role} options={roleOptions} onChange={change} />
          <Input label="Пошта" name="email" type="email" value={form.email} onChange={change} required maxLength={INPUT_LIMITS.email} />
          <Input label="Телефон" name="phone" type="tel" value={form.phone} onChange={change} maxLength={INPUT_LIMITS.phone} inputMode="numeric" pattern="[0-9]{1,20}" />
          <Input label="Пароль" name="password" type="password" value={form.password} onChange={change} required maxLength={INPUT_LIMITS.password} minLength={6} />
          <Input label="Адреса" name="address" value={form.address} onChange={change} />
          
          {isBusiness ? (
            <>
              <Input label="Назва компанії" name="companyName" value={form.companyName} onChange={change} required maxLength={INPUT_LIMITS.companyName} />
              <Input label="ЄДРПОУ" name="edrpou" value={form.edrpou} onChange={change} required maxLength={INPUT_LIMITS.edrpou} inputMode="numeric" pattern="[0-9]{1,20}" />
              <Input label="Контактна особа" name="contact_person" value={form.contact_person} onChange={change} required maxLength={INPUT_LIMITS.personName} />
            </>
          ) : (
            <>            
              <Input label="Ім'я" name="firstName" value={form.firstName} onChange={change} maxLength={INPUT_LIMITS.personName} />
              <Input label="Прізвище" name="lastName" value={form.lastName} onChange={change} maxLength={INPUT_LIMITS.personName} />
            </>
          )}

          {error && <p className="error">{error}</p>}
          <Button type="submit" loading={submitting}>Зареєструватися</Button>
        </form>
        <p>Вже маєте акаунт? <Link to={ROUTES.LOGIN}>Увійти</Link></p>
      </div>
    </div>
  );
}