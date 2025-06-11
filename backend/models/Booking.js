class Booking {
  constructor(pool) {
    this.pool = pool;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        rental_id INTEGER REFERENCES rentals(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        guests INTEGER,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        payment_intent_id VARCHAR(255),
        payment_id INTEGER REFERENCES payments(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async create(bookingData) {
    const {
      user_id,
      rental_id,
      start_date,
      end_date,
      guests,
      total_amount,
      payment_intent_id,
      payment_id
    } = bookingData;

    const query = `
      INSERT INTO bookings (
        user_id, rental_id, start_date, end_date, guests,
        total_amount, payment_intent_id, payment_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      user_id,
      rental_id,
      start_date,
      end_date,
      guests,
      total_amount,
      payment_intent_id,
      payment_id
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id) {
    const query = `
      SELECT b.*, 
        r.title as rental_title,
        r.image as rental_image,
        p.transaction_id,
        p.payment_method,
        p.paid_at
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      LEFT JOIN payments p ON b.payment_id = p.id
      WHERE b.id = $1;
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = `
      SELECT b.*, 
        r.title as rental_title,
        r.image as rental_image,
        p.transaction_id,
        p.payment_method,
        p.paid_at
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      LEFT JOIN payments p ON b.payment_id = p.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async updateStatus(id, status) {  
    const query = `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await this.pool.query(query, [status, id]);
    return result.rows[0];
  }

  async updatePaymentStatus(id, paymentStatus, paymentIntentId = null) {
    const query = `
      UPDATE bookings
      SET payment_status = $1, 
          payment_intent_id = COALESCE($2, payment_intent_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await this.pool.query(query, [paymentStatus, paymentIntentId, id]);
    return result.rows[0];
  }

  async checkAvailability(itemId, itemType, startDate, endDate) {
    const query = `
      SELECT COUNT(*) as count
      FROM bookings
      WHERE item_id = $1
      AND item_type = $2
      AND status != 'cancelled'
      AND (
        (start_date <= $3 AND end_date >= $3)
        OR (start_date <= $4 AND end_date >= $4)
        OR (start_date >= $3 AND end_date <= $4)
      );
    `;
    const result = await this.pool.query(query, [itemId, itemType, startDate, endDate]);
    return result.rows[0].count === '0';
  }
}

module.exports = Booking; 