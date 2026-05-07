import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';
import { usersApi } from '../../api/users.api.js';

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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (loading) return <Layout><Spinner /></Layout>;
  if (error) return <Layout><ErrorMessage error={error} /></Layout>;
  if (!data) return <Layout><p>Профіль не знайдено</p></Layout>;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
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
      setSavedAt(Date.now());
      setEditing(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setForm(data);
    setEditing(false);
  };

  return (
    <Layout>
      {!editing ? (
        <section className="company-profile">
          <div className="company-profile__header">
            <div>
              <h2 className="company-profile__title">Профіль компанії</h2>
              {savedAt && <small className="hint">Збережено</small>}
            </div>
            <Button onClick={() => setEditing(true)}>Редагувати</Button>
          </div>

          <dl className="company-profile__dl">
            {FIELDS.map((f) => (
              <div className="company-profile__row" key={f.name}>
                <dt>{f.label}</dt>
                <dd>{data[f.name] || '—'}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : (
        <section className="company-profile">
          <div className="company-profile__header">
            <div>
              <h2 className="company-profile__title">Профіль компанії</h2>
              <small className="hint">Редагування</small>
            </div>
          </div>

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
            />
          ))}
          <div className="form-actions">
            <Button type="submit" loading={saving}>Зберегти</Button>
            <Button type="button" variant="ghost" onClick={cancel}>Скасувати</Button>
          </div>
          </form>
        </section>
      )}
    </Layout>
  );
}
