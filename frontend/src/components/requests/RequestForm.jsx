import { useState } from 'react';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';

const INITIAL = {
  type: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  description: '',
  preferredContact: 'phone',
  contactPhone: '',
  contactEmail: '',
  comment: '',
};

const BUSINESS_INITIAL = {
  contactPerson: '',
  address: '',
  serviceType: 'planned',
  deviceId: '',
};

const contactOptions = [
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'messenger', label: 'Месенджер' },
];

const serviceTypeOptions = [
  { value: 'planned', label: 'Планове' },
  { value: 'emergency', label: 'Аварійне' },
  { value: 'preventive', label: 'Профілактичне' },
];

export function RequestForm({
  onSubmit,
  businessFields = false,
  devices = [],
  businessContactPerson,
}) {
  const [form, setForm] = useState(() => ({
    ...INITIAL,
    ...(businessFields ? BUSINESS_INITIAL : {}),
  }));

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const deviceOptions = devices.map((d) => ({
    value: String(d.id),
    label: `${d.type} ${d.manufacturer || ''} ${d.model || ''}${d.serial_number ? ` (S/N: ${d.serial_number})` : ''}`.trim(),
  }));

  return (
    <form onSubmit={submit} className="request-form">
      {businessFields && devices.length > 0 && (
        <Select
          label="Техніка зі списку компанії"
          name="deviceId"
          value={form.deviceId}
          options={deviceOptions}
          placeholder="— оберіть пристрій або заповніть поля нижче —"
          onChange={change}
          hint="Якщо обрано — поля виробника/моделі можна не заповнювати"
        />
      )}

      <Input label="Тип техніки" name="type" value={form.type} onChange={change} required />
      <Input label="Виробник" name="manufacturer" value={form.manufacturer} onChange={change} />
      <Input label="Модель" name="model" value={form.model} onChange={change} />
      <Input label="Серійний номер" name="serialNumber" value={form.serialNumber} onChange={change} />
      <Input
        label="Опис несправності або потреби в обслуговуванні"
        name="description"
        value={form.description}
        onChange={change}
        required
      />

      <Input
        label="Контактний телефон"
        name="contactPhone"
        type="tel"
        value={form.contactPhone}
        onChange={change}
      />
      <Input
        label="Електронна пошта"
        name="contactEmail"
        type="email"
        value={form.contactEmail}
        onChange={change}
      />
      <Select
        label="Бажаний спосіб зв'язку"
        name="preferredContact"
        value={form.preferredContact}
        options={contactOptions}
        onChange={change}
      />

      {businessFields && (
        <>
          {businessContactPerson !== undefined && (
            <Input
              label="Контактна особа"
              name="contactPerson"
              value={businessContactPerson || '—'}
              onChange={change}
              disabled
              hint="Береться з профілю компанії"
            />
          )}
          <Input
            label="Адреса об'єкта"
            name="address"
            value={form.address}
            onChange={change}
            required
          />
          <Select
            label="Тип обслуговування"
            name="serviceType"
            value={form.serviceType}
            options={serviceTypeOptions}
            onChange={change}
          />
        </>
      )}

      <Input
        label="Додатковий коментар"
        name="comment"
        value={form.comment}
        onChange={change}
        hint="За потреби вкажіть деталі"
      />

      <Button type="submit" variant="primary">Створити заявку</Button>
    </form>
  );
}
