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

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', phone: '', password: '', role: ROLES.CLIENT });
  const [error, setError] = useState(null);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Реєстрація</h2>
      <form onSubmit={submit}>
        <Input label="Пошта" name="email" type="email" value={form.email} onChange={change} required />
        <Input label="Телефон" name="phone" value={form.phone} onChange={change} />
        <Input label="Пароль" name="password" type="password" value={form.password} onChange={change} required />
        <Select label="Роль" name="role" value={form.role} options={roleOptions} onChange={change} />
        {error && <p className="error">{error}</p>}
        <Button type="submit">Зареєструватися</Button>
      </form>
      <p>Вже маєте акаунт? <Link to={ROUTES.LOGIN}>Увійти</Link></p>
    </div>
  );
}
