-- Roles dictionary
CREATE TABLE IF NOT EXISTS roles (
  code VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL
);

INSERT INTO roles (code, label) VALUES
  ('Клієнт', 'Клієнт'),
  ('Менеджер', 'Менеджер'),
  ('Майстер', 'Майстер'),
  ('Бізнес-клієнт', 'Бізнес-клієнт')
ON CONFLICT (code) DO NOTHING;

-- Request statuses dictionary
CREATE TABLE IF NOT EXISTS request_statuses (
  code VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO request_statuses (code, label, sort_order) VALUES
  ('new_request',             'Нова заявка',              10),
  ('accepted',                'Прийнято в обробку',       20),
  ('awaiting_clarification',  'Очікує уточнення',         30),
  ('technician_assigned',     'Призначено майстра',       40),
  ('diagnostics_in_progress', 'Виконується діагностика',  50),
  ('awaiting_approval',       'Очікується погодження',    60),
  ('repair_in_progress',      'Виконується ремонт',       70),
  ('awaiting_parts',          'Очікуються запчастини',    80),
  ('completed',               'Завершено',                90),
  ('delivered',               'Видано клієнту',          100),
  ('cancelled',               'Скасовано',               110)
ON CONFLICT (code) DO NOTHING;

-- Notification types dictionary
CREATE TABLE IF NOT EXISTS notification_types (
  code VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL
);

INSERT INTO notification_types (code, label) VALUES
  ('request_created',      'Заявку створено'),
  ('request_accepted',     'Заявку прийнято в обробку'),
  ('technician_assigned',  'Призначено майстра'),
  ('status_changed',       'Змінено статус замовлення'),
  ('clarification_needed', 'Потрібне уточнення'),
  ('repair_completed',     'Ремонт завершено'),
  ('request_cancelled',    'Замовлення скасовано')
ON CONFLICT (code) DO NOTHING;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL REFERENCES roles(code),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client profiles
CREATE TABLE IF NOT EXISTS client_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Business client profiles
CREATE TABLE IF NOT EXISTS business_client_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  edrpou VARCHAR(20),
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Technician profiles
CREATE TABLE IF NOT EXISTS technician_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  specialty VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES client_profiles(id),
  business_client_id INTEGER REFERENCES business_client_profiles(id),
  type VARCHAR(100),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service requests
CREATE TABLE IF NOT EXISTS service_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,
  client_id INTEGER REFERENCES client_profiles(id),
  business_client_id INTEGER REFERENCES business_client_profiles(id),
  device_id INTEGER REFERENCES devices(id),
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL REFERENCES request_statuses(code),
  assigned_technician_id INTEGER REFERENCES technician_profiles(id),
  preferred_contact VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Request comments
CREATE TABLE IF NOT EXISTS request_comments (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES service_requests(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  author_role VARCHAR(50) REFERENCES roles(code),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  request_id INTEGER REFERENCES service_requests(id),
  type VARCHAR(50) REFERENCES notification_types(code),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Work reports
CREATE TABLE IF NOT EXISTS work_reports (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES service_requests(id),
  technician_id INTEGER NOT NULL REFERENCES technician_profiles(id),
  diagnostic_result TEXT,
  work_description TEXT,
  used_parts TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance plans
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id SERIAL PRIMARY KEY,
  business_client_id INTEGER NOT NULL REFERENCES business_client_profiles(id),
  device_id INTEGER REFERENCES devices(id),
  type VARCHAR(50),
  schedule_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
