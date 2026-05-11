import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

const ROLE_HOME = {
  [ROLES.CLIENT]: ROUTES.CLIENT.DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER.DASHBOARD,
  [ROLES.TECHNICIAN]: ROUTES.MASTER.DASHBOARD,
  [ROLES.BUSINESS_CLIENT]: ROUTES.BUSINESS.DASHBOARD
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(ROLE_HOME[user.role] || ROUTES.HOME);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-screen">
      <div className="canvas-card canvas-card--auth auth-page">
        <h2>Вхід</h2>
        <form onSubmit={submit}>
          <Input label="Пошта або телефон" name="login" type="text" value={form.login} onChange={change} required autoComplete="username" />
          <Input label="Пароль" name="password" type="password" value={form.password} onChange={change} required />
          {error && <p className="error">{error}</p>}
          <Button type="submit">Увійти</Button>
        </form>
        <p>Ще немає акаунта? <Link to={ROUTES.REGISTER}>Зареєструватися</Link></p>
      </div>
    </div>
  );
}
