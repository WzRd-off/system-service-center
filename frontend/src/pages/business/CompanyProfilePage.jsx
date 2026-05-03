import { Layout } from '../../components/layout/Layout.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { businessClientsApi } from '../../api/businessClients.api.js';

export function CompanyProfilePage() {
  const { data, loading } = useFetch(() => businessClientsApi.getProfile());

  if (loading) return <Layout><Spinner /></Layout>;
  if (!data) return <Layout><p>Профіль не знайдено</p></Layout>;

  return (
    <Layout>
      <h2>Профіль компанії</h2>
      <dl>
        <dt>Назва</dt><dd>{data.company_name}</dd>
        <dt>ЄДРПОУ</dt><dd>{data.edrpou || '—'}</dd>
        <dt>Контактна особа</dt><dd>{data.contact_person || '—'}</dd>
        <dt>Телефон</dt><dd>{data.phone || '—'}</dd>
        <dt>Пошта</dt><dd>{data.email || '—'}</dd>
        <dt>Адреса</dt><dd>{data.address || '—'}</dd>
      </dl>
    </Layout>
  );
}
