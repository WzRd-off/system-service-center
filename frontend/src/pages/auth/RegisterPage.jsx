import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

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

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
          <Input label="Пошта" name="email" type="email" value={form.email} onChange={change} required />
          <Input label="Телефон" name="phone" type="tel" value={form.phone} onChange={change} />
          <Input label="Пароль" name="password" type="password" value={form.password} onChange={change} required />
          <Input label="Адреса" name="address" value={form.address} onChange={change} />
          
          {isBusiness ? (
            <>
              <Input label="Назва компанії" name="companyName" value={form.companyName} onChange={change} required />
              <Input label="ЄДРПОУ" name="edrpou" value={form.edrpou} onChange={change} required />
              <Input label="Контактна особа" name="contact_person" value={form.contact_person} onChange={change} required />
            </>
          ) : (
            <>            
              <Input label="Ім'я" name="firstName" value={form.firstName} onChange={change} />
              <Input label="Прізвище" name="lastName" value={form.lastName} onChange={change} />
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