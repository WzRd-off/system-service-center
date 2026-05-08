import { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Select } from '../../components/common/Select.jsx';
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
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('last_name');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const visibleMasters = useMemo(() => {
    const list = Array.isArray(masters.data) ? masters.data : [];
    const query = search.trim().toLowerCase();

    const filtered = query
      ? list.filter((m) =>
          [
            m.last_name,
            m.first_name,
            m.specialty,
            m.email,
            m.phone,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        )
      : list;

    return [...filtered].sort((a, b) => {
      const left = String(a?.[sortField] || '');
      const right = String(b?.[sortField] || '');
      const cmp = left.localeCompare(right, 'uk', { sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [masters.data, search, sortField, sortDirection]);

  return (
    <Layout>
      <div className="canvas-stack">
        <section className="canvas-card canvas-card--compact">
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
        </section>

      {activeTab === 'create' && (
        <section className="canvas-card">
          <h3>Реєстрація нового майстра</h3>
          <form onSubmit={submit} className="section-stack">
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
        <section className="canvas-card">
          <h3>Список майстрів</h3>
          <ErrorMessage error={listError} />

          {masters.loading ? (
            <Spinner />
          ) : masters.error ? (
            <ErrorMessage error={masters.error} />
          ) : !masters.data?.length ? (
            <p>Майстрів немає</p>
          ) : (
            <>
              <div className="request-filters canvas-filters">
                <Input
                  label="Пошук"
                  placeholder="Прізвище, email, спеціалізація..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  label="Сортувати за"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  options={[
                    { value: 'last_name', label: 'Прізвище' },
                    { value: 'first_name', label: 'Імʼя' },
                    { value: 'specialty', label: 'Спеціалізація' },
                    { value: 'email', label: 'Email' },
                  ]}
                />
                <Select
                  label="Напрям"
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  options={[
                    { value: 'asc', label: 'За зростанням' },
                    { value: 'desc', label: 'За спаданням' },
                  ]}
                />
              </div>

              <div className="table-wrap">
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
                    {visibleMasters.map((m) => (
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
              </div>
              {!visibleMasters.length && <p>За вашим запитом нічого не знайдено</p>}
            </>
          )}
        </section>
      )}
      </div>
    </Layout>
  );
}
