-- Add concierge booking fields to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS service_id integer REFERENCES concierge_services(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS service_type varchar(20) DEFAULT 'rental',
ADD COLUMN IF NOT EXISTS date date,
ADD COLUMN IF NOT EXISTS time time,
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS notes text;

-- Update existing bookings to have service_type = 'rental'
UPDATE bookings SET service_type = 'rental' WHERE service_type IS NULL;

-- Add check constraint to ensure either rental_id or service_id is set
ALTER TABLE bookings
ADD CONSTRAINT check_booking_type
CHECK (
  (service_type = 'rental' AND rental_id IS NOT NULL AND service_id IS NULL) OR
  (service_type = 'concierge' AND service_id IS NOT NULL AND rental_id IS NULL)
); 