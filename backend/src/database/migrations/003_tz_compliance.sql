-- Client comment on service request (form "додатковий коментар")
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS client_comment TEXT;

-- Audit trail for status changes (ТЗ п. 4.3)
CREATE TABLE IF NOT EXISTS request_status_history (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(50) REFERENCES request_statuses(code),
  new_status VARCHAR(50) NOT NULL REFERENCES request_statuses(code),
  changed_by_user_id INTEGER REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);
