import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usersApi } from '../api/users.api.js';
import { authApi } from '../api/auth.api.js';
import { ROLES } from '../constants/roles.js';
import { isEmail, isPhone, isStrongPassword } from '../utils/validators.js';

const BASE_PROFILE_FIELDS = [
  { name: 'first_name', label: "Ім'я" },
  { name: 'last_name', label: 'Прізвище' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Телефон', type: 'tel' },
];

export function ProfilePage() {
  const { user } = useAuth();
  const profile = useFetch(() => usersApi.getProfile(), []);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' або 'password'
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMessage, setPwdMessage] = useState(null);

  useEffect(() => {
    if (profile.data) setForm(profile.data);
  }, [profile.data]);

  if (profile.loading) return <Layout><Spinner /></Layout>;

  const isBusinessClient = user?.role === ROLES.BUSINESS_CLIENT;

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setProfileMessage(null);
  };

  const validateProfile = () => {
    const er = {};
    if (!isBusinessClient && !form.first_name?.trim()) er.first_name = "Вкажіть ім'я";
    if (form.email && !isEmail(form.email)) er.email = 'Некоректний email';
    if (form.phone && !isPhone(form.phone)) er.phone = 'Некоректний телефон';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await usersApi.updateProfile(form);
      setProfileMessage({ type: 'success', text: 'Дані збережено' });
      profile.reload();
    } catch (err) {
      setProfileMessage({ type: 'error', text: err?.message || 'Помилка збереження' });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePwd = (e) => {
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));
    setPwdErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setPwdMessage(null);
  };

  const validatePwd = () => {
    const er = {};
    if (!pwd.currentPassword) er.currentPassword = 'Вкажіть поточний пароль';
    if (!isStrongPassword(pwd.newPassword)) er.newPassword = 'Мінімум 6 символів';
    if (pwd.newPassword !== pwd.confirmPassword) er.confirmPassword = 'Паролі не співпадають';
    if (pwd.currentPassword && pwd.currentPassword === pwd.newPassword) {
      er.newPassword = 'Новий пароль має відрізнятись від поточного';
    }
    setPwdErrors(er);
    return Object.keys(er).length === 0;
  };

  const submitPwd = async (e) => {
    e.preventDefault();
    if (!validatePwd()) return;
    setSavingPwd(true);
    setPwdMessage(null);
    try {
      await authApi.changePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwdMessage({ type: 'success', text: 'Пароль змінено' });
    } catch (err) {
      setPwdMessage({ type: 'error', text: err?.message || 'Не вдалось змінити пароль' });
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <Layout>
      <h2>Особистий профіль</h2>

      <div className="tabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Дані профілю
        </button>
        <button
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Зміна пароля
        </button>
      </div>

      {activeTab === 'profile' && (
        <section>
          <h3>Персональні дані</h3>
          <p className="hint">Роль: {user?.role || '—'}</p>
          <form onSubmit={saveProfile} className="profile-form">
            {[
            ...(isBusinessClient
              ? BASE_PROFILE_FIELDS.filter((f) => !['first_name', 'last_name'].includes(f.name))
              : BASE_PROFILE_FIELDS),
            ...(user?.role === ROLES.CLIENT ? [{ name: 'address', label: 'Адреса' }] : []),
            ...(user?.role === ROLES.TECHNICIAN ? [{ name: 'specialty', label: 'Спеціалізація' }] : []),
            ...(isBusinessClient ? [{ name: 'company_name', label: 'Назва компанії' }] : []),
          ].map((f) => (
            <Input
              key={f.name}
              label={f.label}
              name={f.name}
              type={f.type || 'text'}
              value={form[f.name] || ''}
              onChange={change}
              error={errors[f.name]}
            />
          ))}
          <div className="form-actions">
            <Button type="submit" loading={savingProfile}>Зберегти зміни</Button>
          </div>
          {profileMessage && (
            <p className={profileMessage.type === 'error' ? 'error' : 'success'}>
              {profileMessage.text}
            </p>
          )}
        </form>
      </section>
      )}

      {activeTab === 'password' && (
        <section>
          <h3>Зміна пароля</h3>
          <form onSubmit={submitPwd} className="profile-form">
            <Input
              label="Поточний пароль"
            name="currentPassword"
            type="password"
            value={pwd.currentPassword}
            onChange={changePwd}
            error={pwdErrors.currentPassword}
            autoComplete="current-password"
            required
          />
          <Input
            label="Новий пароль"
            name="newPassword"
            type="password"
            value={pwd.newPassword}
            onChange={changePwd}
            error={pwdErrors.newPassword}
            hint="Мінімум 6 символів"
            autoComplete="new-password"
            required
          />
          <Input
            label="Підтвердження пароля"
            name="confirmPassword"
            type="password"
            value={pwd.confirmPassword}
            onChange={changePwd}
            error={pwdErrors.confirmPassword}
            autoComplete="new-password"
            required
          />
          <div className="form-actions">
            <Button type="submit" loading={savingPwd}>Змінити пароль</Button>
          </div>
          {pwdMessage && (
            <p className={pwdMessage.type === 'error' ? 'error' : 'success'}>
              {pwdMessage.text}
            </p>
          )}
        </form>
      </section>
      )}
    </Layout>
  );
}
