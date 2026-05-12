import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { usersApi } from '../../api/users.api.js';
import { isEmail, isPhone } from '../../utils/validators.js';

const FIELDS = [
  { name: 'company_name', label: 'Назва компанії', required: true },
  { name: 'edrpou', label: 'ЄДРПОУ' },
  { name: 'contact_person', label: 'Контактна особа' },
  { name: 'phone', label: 'Телефон', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Адреса обслуговування' },
];

export function CompanyProfilePage() {
  const { data, loading, error, reload } = useFetch(() => businessClientsApi.getProfile());
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (loading) return <Layout><Spinner /></Layout>;
  if (error) return <Layout><ErrorMessage error={error} /></Layout>;
  if (!data) return <Layout><p>Профіль не знайдено</p></Layout>;

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setProfileMessage(null);
  };

  const validate = () => {
    const er = {};
    if (!form.company_name?.trim()) er.company_name = 'Вкажіть назву компанії';
    if (form.email && !isEmail(form.email)) er.email = 'Некоректний email';
    if (form.phone && !isPhone(form.phone)) er.phone = 'Некоректний телефон';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setProfileMessage(null);
    try {
      await businessClientsApi.updateProfile({
        company_name: form.company_name,
        edrpou: form.edrpou,
        contact_person: form.contact_person,
        address: form.address,
      });
      await usersApi.updateProfile({
        phone: form.phone,
        email: form.email,
      });
      setProfileMessage({ type: 'success', text: 'Дані збережено' });
      reload();
    } catch (err) {
      setProfileMessage({ type: 'error', text: err?.message || 'Помилка збереження' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <h2>Профіль компанії</h2>

      <section>
        <h3>Реквізити компанії</h3>
        <form onSubmit={save} className="profile-form">
          {FIELDS.map((f) => (
            <Input
              key={f.name}
              label={f.label}
              name={f.name}
              type={f.type || 'text'}
              required={f.required}
              value={form[f.name] || ''}
              onChange={change}
              error={errors[f.name]}
            />
          ))}
          <div className="form-actions">
            <Button type="submit" loading={saving}>Зберегти зміни</Button>
          </div>
          {profileMessage && (
            <p className={profileMessage.type === 'error' ? 'error' : 'success'}>
              {profileMessage.text}
            </p>
          )}
        </form>
      </section>
    </Layout>
  );
}
