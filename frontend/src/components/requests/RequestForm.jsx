import { useState } from 'react';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

const INITIAL = {
  type: '', manufacturer: '', model: '', serialNumber: '',
  description: '', preferredContact: 'phone'
};

export function RequestForm({ onSubmit, businessFields = false }) {
  const [form, setForm] = useState(INITIAL);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submit} className="request-form">
      <Input label="Тип техніки" name="type" value={form.type} onChange={change} required />
      <Input label="Виробник" name="manufacturer" value={form.manufacturer} onChange={change} />
      <Input label="Модель" name="model" value={form.model} onChange={change} />
      <Input label="Серійний номер" name="serialNumber" value={form.serialNumber} onChange={change} />
      <Input label="Опис проблеми" name="description" value={form.description} onChange={change} required />
      <Input label="Бажаний спосіб зв'язку" name="preferredContact" value={form.preferredContact} onChange={change} />
      {businessFields && (
        <>
          <Input label="Адреса об'єкта" name="address" value={form.address || ''} onChange={change} />
          <Input label="Тип обслуговування" name="serviceType" value={form.serviceType || ''} onChange={change} />
        </>
      )}
      <Button type="submit">Створити заявку</Button>
    </form>
  );
}
