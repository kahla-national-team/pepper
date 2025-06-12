class BookingService {
  constructor(pool) {
    this.pool = pool;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS booking_services (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES concierge_services(id) ON DELETE CASCADE,
        service_name VARCHAR(255) NOT NULL,
        service_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async create(bookingServiceData) {
    const {
      booking_id,
      service_id,
      service_name,
      service_price
    } = bookingServiceData;

    const query = `
      INSERT INTO booking_services (
        booking_id, service_id, service_name, service_price
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      booking_id,
      service_id,
      service_name,
      service_price
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByBookingId(bookingId) {
    const query = `
      SELECT bs.*, cs.name as service_title, cs.category
      FROM booking_services bs
      LEFT JOIN concierge_services cs ON bs.service_id = cs.id
      WHERE bs.booking_id = $1;
    `;
    const result = await this.pool.query(query, [bookingId]);
    return result.rows;
  }

  async deleteByBookingId(bookingId) {
    const query = `
      DELETE FROM booking_services
      WHERE booking_id = $1;
    `;
    await this.pool.query(query, [bookingId]);
  }
}

module.exports = BookingService; 