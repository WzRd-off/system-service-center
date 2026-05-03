import { useState } from 'react';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

export function DeviceForm({ onSubmit }) {
  const [form, setForm] = useState({ type: '', manufacturer: '', model: '', serialNumber: '', notes: '' });
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submit} className="device-form">
      <Input label="Тип" name="type" value={form.type} onChange={change} required />
      <Input label="Виробник" name="manufacturer" value={form.manufacturer} onChange={change} />
      <Input label="Модель" name="model" value={form.model} onChange={change} />
      <Input label="Серійний номер" name="serialNumber" value={form.serialNumber} onChange={change} />
      <Input label="Примітки" name="notes" value={form.notes} onChange={change} />
      <Button type="submit">Додати</Button>
    </form>
  );
}
