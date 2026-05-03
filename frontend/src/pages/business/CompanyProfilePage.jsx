import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

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
      await businessClientsApi.updateProfile(form);
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
      <h2>Профіль компанії</h2>
      {!editing ? (
        <>
          <dl>
            {FIELDS.map((f) => (
              <div key={f.name}>
                <dt>{f.label}</dt>
                <dd>{data[f.name] || '—'}</dd>
              </div>
            ))}
          </dl>
          <Button onClick={() => setEditing(true)}>Редагувати</Button>
          {savedAt && <small className="hint"> Збережено</small>}
        </>
      ) : (
        <form onSubmit={save}>
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
      )}
    </Layout>
  );
}
