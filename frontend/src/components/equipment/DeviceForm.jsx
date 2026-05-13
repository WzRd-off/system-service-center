import { useState } from 'react';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';
import { INPUT_LIMITS, sanitizeLongText, sanitizeSerial, sanitizeSimpleText } from '../../utils/validators.js';

export function DeviceForm({ onSubmit }) {
  const [form, setForm] = useState({ type: '', manufacturer: '', model: '', serialNumber: '', notes: '' });
  const change = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'serialNumber') nextValue = sanitizeSerial(value);
    if (name === 'notes') nextValue = sanitizeLongText(value);
    if (name === 'type' || name === 'manufacturer' || name === 'model') nextValue = sanitizeSimpleText(value);
    setForm((f) => ({ ...f, [name]: nextValue }));
  };
  const submit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submit} className="device-form">
      <Input label="Тип" name="type" value={form.type} onChange={change} required maxLength={INPUT_LIMITS.shortText} />
      <Input label="Виробник" name="manufacturer" value={form.manufacturer} onChange={change} maxLength={INPUT_LIMITS.shortText} />
      <Input label="Модель" name="model" value={form.model} onChange={change} maxLength={INPUT_LIMITS.shortText} />
      <Input label="Серійний номер" name="serialNumber" value={form.serialNumber} onChange={change} maxLength={INPUT_LIMITS.serialNumber} />
      <Input label="Примітки" name="notes" value={form.notes} onChange={change} />
      <Button type="submit">Додати</Button>
    </form>
  );
}
