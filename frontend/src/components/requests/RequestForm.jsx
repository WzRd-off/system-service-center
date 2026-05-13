import { useState } from 'react';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import {
  INPUT_LIMITS,
  sanitizeAddress,
  sanitizeDigits,
  sanitizeEmail,
  sanitizeLongText,
  sanitizePersonName,
  sanitizeSerial,
  sanitizeSimpleText,
} from '../../utils/validators.js';

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
  equipmentSelect = false,
  devices = [],
  businessContactPerson,
}) {
  const showDevicePicker =
    devices.length > 0 && (businessFields || equipmentSelect);

  const [form, setForm] = useState(() => ({
    ...INITIAL,
    ...(businessFields ? BUSINESS_INITIAL : {}),
    ...(!businessFields && equipmentSelect ? { deviceId: '' } : {}),
  }));

  const change = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'type' || name === 'manufacturer' || name === 'model') nextValue = sanitizeSimpleText(value);
    if (name === 'serialNumber') nextValue = sanitizeSerial(value);
    if (name === 'description' || name === 'comment') nextValue = sanitizeLongText(value);
    if (name === 'contactPhone') nextValue = sanitizeDigits(value);
    if (name === 'contactEmail') nextValue = sanitizeEmail(value);
    if (name === 'address') nextValue = sanitizeAddress(value);
    if (name === 'contactPerson') nextValue = sanitizePersonName(value);
    setForm((f) => {
      if (name === 'deviceId' && (businessFields || equipmentSelect)) {
        const next = { ...f, deviceId: nextValue };
        if (!value) {
          return { ...next, type: '', manufacturer: '', model: '', serialNumber: '' };
        }
        const d = devices.find((x) => String(x.id) === value);
        if (d) {
          return {
            ...next,
            type: d.type || '',
            manufacturer: d.manufacturer || '',
            model: d.model || '',
            serialNumber: d.serial_number || '',
          };
        }
        return next;
      }
      return { ...f, [name]: nextValue };
    });
  };

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
      <div className="form-section">
        <h3 className="section-title">Інформація про техніку</h3>

        {showDevicePicker && (
          <div className="request-form-device-select">
            <Select
              label={
                businessFields
                  ? 'Техніка зі списку компанії'
                  : 'Техніка з мого списку'
              }
              name="deviceId"
              value={form.deviceId}
              options={deviceOptions}
              placeholder="— оберіть пристрій або заповніть поля нижче —"
              onChange={change}
              hint="Після вибору поля нижче заповняться автоматично; їх можна змінити вручну"
            />
          </div>
        )}

        <div className="grid-2">
          <Input label="Тип техніки" name="type" value={form.type} onChange={change} required maxLength={INPUT_LIMITS.shortText} />
          <Input label="Серійний номер" name="serialNumber" value={form.serialNumber} onChange={change} maxLength={INPUT_LIMITS.serialNumber} />
          <Input label="Виробник" name="manufacturer" value={form.manufacturer} onChange={change} maxLength={INPUT_LIMITS.shortText} />
          <Input label="Модель" name="model" value={form.model} onChange={change} maxLength={INPUT_LIMITS.shortText} />
        </div>

        <div className="request-form-textarea">
          <Input
            type="textarea"
            label="Опис несправності або потреби в обслуговуванні"
            name="description"
            value={form.description}
            onChange={change}
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Контактні дані</h3>

        <div className="grid-2">
          <Input
            label="Контактний телефон"
            name="contactPhone"
            type="tel"
            value={form.contactPhone}
            onChange={change}
            maxLength={INPUT_LIMITS.phone}
            inputMode="numeric"
            pattern="[0-9]{1,20}"
          />
          <Input
            label="Електронна пошта"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={change}
            maxLength={INPUT_LIMITS.email}
          />
        </div>
        <div className="request-form-preferred-contact">
          <Select
            label="Бажаний спосіб зв'язку"
            name="preferredContact"
            value={form.preferredContact}
            options={contactOptions}
            onChange={change}
          />
        </div>
      </div>

      {businessFields && (
        <div className="form-section">
          <h3 className="section-title">Деталі об'єкта та обслуговування</h3>

          <div className="grid-2">
            {businessContactPerson !== undefined && (
              <Input
                label="Контактна особа"
                name="contactPerson"
                value={businessContactPerson || '—'}
                onChange={change}
                disabled
                hint="Береться з профілю компанії"
              maxLength={INPUT_LIMITS.personName}
              />
            )}
            <Input
              label="Адреса об'єкта"
              name="address"
              value={form.address}
              onChange={change}
              required
            />
          </div>
          <div className="request-form-preferred-contact">
            <Select
              label="Тип обслуговування"
              name="serviceType"
              value={form.serviceType}
              options={serviceTypeOptions}
              onChange={change}
            />
          </div>
        </div>
      )}

      <div className="form-section">
        <Input
          label="Додатковий коментар"
          name="comment"
          value={form.comment}
          onChange={change}
          hint="За потреби вкажіть деталі"
        />
      </div>

      <div className="form-section form-section--footer">
        <Button type="submit" variant="primary">Створити заявку</Button>
      </div>
    </form>
  );
}
