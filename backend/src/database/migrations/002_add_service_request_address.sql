-- Add per-request service/object address (business clients may have multiple sites)
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS service_address TEXT;

