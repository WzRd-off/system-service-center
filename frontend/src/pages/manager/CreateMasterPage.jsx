import { useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { mastersApi } from '../../api/masters.api.js';

const INITIAL = {
  email: '',
  phone: '',
  password: '',
  firstName: '',
  lastName: '',
  specialty: ''
};

export function CreateMasterPage() {
  const masters = useFetch(() => mastersApi.list(), []);
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'list'
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [listError, setListError] = useState(null);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!form.email.trim() || !form.password.trim()) {
      setFormError('Пошта і пароль обовʼязкові');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Пароль має містити щонайменше 6 символів');
      return;
    }

    setSubmitting(true);
    try {
      await mastersApi.create({
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        password: form.password,
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
        specialty: form.specialty.trim() || null
      });
      setForm(INITIAL);
      setFormSuccess('Майстра успішно зареєстровано');
      masters.reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (master) => {
    const name = [master.last_name, master.first_name].filter(Boolean).join(' ') || master.email;
    if (!window.confirm(`Видалити майстра «${name}»?`)) return;

    setListError(null);
    setRemovingId(master.id);
    try {
      await mastersApi.remove(master.id);
      masters.reload();
    } catch (err) {
      setListError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Layout>
      <h2>Майстри</h2>

      <div className="tabs">
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Реєстрація
        </button>
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          Список
        </button>
      </div>

      {activeTab === 'create' && (
        <section className="card">
          <h3>Реєстрація нового майстра</h3>
          <form onSubmit={submit}>
            <Input label="Пошта" name="email" type="email" value={form.email} onChange={change} required />
            <Input label="Пароль" name="password" type="password" value={form.password} onChange={change} required />
            <Input label="Телефон" name="phone" type="tel" value={form.phone} onChange={change} />
            <Input label="Імʼя" name="firstName" value={form.firstName} onChange={change} />
            <Input label="Прізвище" name="lastName" value={form.lastName} onChange={change} />
            <Input label="Спеціалізація" name="specialty" value={form.specialty} onChange={change} />

            {formError && <p className="error">{formError}</p>}
            {formSuccess && <p className="success">{formSuccess}</p>}

            <Button type="submit" loading={submitting}>Зареєструвати</Button>
          </form>
        </section>
      )}

      {activeTab === 'list' && (
        <section className="card">
          <h3>Список майстрів</h3>
          <ErrorMessage error={listError} />

          {masters.loading ? (
            <Spinner />
          ) : masters.error ? (
            <ErrorMessage error={masters.error} />
          ) : !masters.data?.length ? (
            <p>Майстрів немає</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Прізвище</th>
                  <th>Імʼя</th>
                  <th>Спеціалізація</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {masters.data.map((m) => (
                  <tr key={m.id}>
                    <td>{m.last_name || '—'}</td>
                    <td>{m.first_name || '—'}</td>
                    <td>{m.specialty || '—'}</td>
                    <td>{m.email}</td>
                    <td>{m.phone || '—'}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={removingId === m.id}
                        onClick={() => remove(m)}
                      >
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </Layout>
  );
}
