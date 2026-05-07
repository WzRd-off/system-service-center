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
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Technician profiles
CREATE TABLE IF NOT EXISTS technician_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  specialty VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Managers profiles
CREATE TABLE IF NOT EXISTS manager_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
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
  user_id INTEGER REFERENCES users(id),
  device_id INTEGER REFERENCES devices(id),
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL REFERENCES request_statuses(code),
  assigned_technician_id INTEGER REFERENCES technician_profiles(id),
  preferred_contact VARCHAR(50),
  service_type VARCHAR(50),
  service_address TEXT,
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

INSERT INTO users (email, phone, password, role) VALUES
('client@gmail.com', '0987654321', '$2b$10$0d2lhLePsYaQFajkctyvBu1jECwqi8zyUX10U8g02IQ65SL8qkZ8a', 'Клієнт'),
('business-client@gmail.com', '0997654321', '$2b$10$BvYFC4YLLce9Xd2ADL1rIeMQ/vcsJ4Y4bCA3waqOJ3wh6rGU6XXkO', 'Бізнес-клієнт'),
('manager@gmail.com', '088765431', '$2b$10$ddSeGTt6NcOlo8LWwuZGL..mok.gczdBu7Ow3L0wzaNBxSeqIRwCW', 'Менеджер'),
('master@gmail.com', '0977543212', '$2b$10$NM3t9Rgn95STGJ6Qp9RRz.VtkVlsWf3VtRG2s1G9yfTSu3IP101D6', 'Майстер');

INSERT INTO client_profiles (user_id, first_name, last_name, address) VALUES
(1, 'Іван', 'Іванов', 'вул. Пушкіна, 10, кв. 5');

INSERT INTO business_client_profiles (user_id, company_name, edrpou, contact_person, address) VALUES
(2, 'ТОВ ТехноСервіс', '12345678', 'Петро Петров', 'вул. Канатна, 20');

INSERT INTO manager_profiles (user_id, first_name, last_name) VALUES
(3, 'Ольга', 'Ольгова');

INSERT INTO technician_profiles (user_id, first_name, last_name, specialty) VALUES
(4, 'Сергій', 'Сергієнко', 'Ремонт компютерів');
