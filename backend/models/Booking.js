const BookingService = require('./BookingService');

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
        status booking_status NOT NULL DEFAULT 'pending',
        payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        payment_intent_id VARCHAR(255),
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
      payment_intent_id
    } = bookingData;

    const query = `
      INSERT INTO bookings (
        user_id, rental_id, start_date, end_date, guests,
        total_amount, payment_intent_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      user_id,
      rental_id,
      start_date,
      end_date,
      guests,
      total_amount,
      payment_intent_id || null
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id) {
    const query = `
      SELECT b.*, 
        r.title as rental_title,
        r.image as rental_image
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      WHERE b.id = $1;
    `;
    const result = await this.pool.query(query, [id]);
    const booking = result.rows[0];
    
    if (booking) {
      // Get services for this booking
      const bookingServiceModel = new BookingService(this.pool);
      const services = await bookingServiceModel.findByBookingId(id);
      booking.services = services;
    }
    
    return booking;
  }

  async findByUserId(userId) {
    const query = `
      SELECT b.*, 
        r.title as rental_title,
        r.image as rental_image
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const result = await this.pool.query(query, [userId]);
    const bookings = result.rows;
    
    // Get services for each booking
    const bookingServiceModel = new BookingService(this.pool);
    for (const booking of bookings) {
      const services = await bookingServiceModel.findByBookingId(booking.id);
      booking.services = services;
    }
    
    return bookings;
  }

  async findByOwnerId(ownerId) {
    const query = `
      SELECT b.*, 
        r.title as rental_title,
        r.image as rental_image,
        u.username as guest_name,
        u.email as guest_email
      FROM bookings b
      LEFT JOIN rentals r ON b.rental_id = r.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE r.owner_id = $1
      ORDER BY b.created_at DESC;
    `;
    const result = await this.pool.query(query, [ownerId]);
    const bookings = result.rows;
    
    // Get services for each booking
    const bookingServiceModel = new BookingService(this.pool);
    for (const booking of bookings) {
      const services = await bookingServiceModel.findByBookingId(booking.id);
      booking.services = services;
    }
    
    return bookings;
  }

  async updateStatus(id, status) {  
    try {
      console.log('Booking.updateStatus called with:', { id, status });
      
      // First verify the booking exists
      const booking = await this.findById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Validate status
      const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }

      const query = `
        UPDATE bookings
          SET status = $1::booking_status,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
          RETURNING *
      `;
      
      console.log('Executing query:', query, 'with params:', [status, id]);
      
      const result = await this.pool.query(query, [status, id]);
      console.log('Query result:', result.rows[0]);
      
      if (result.rows.length === 0) {
        throw new Error('Booking not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in Booking.updateStatus:', error);
      throw error;
    }
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

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, val] of Object.entries(updateData)) {
      fields.push(`${key} = $${idx}`);
      values.push(val);
      idx++;
    }
    values.push(id);

    const query = `
      UPDATE bookings
      SET ${fields.join(',')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async checkAvailability(rentalId, startDate, endDate) {
    const query = `
      SELECT COUNT(*) as count
      FROM bookings
      WHERE rental_id = $1
      AND status != 'cancelled'
      AND (
        (start_date <= $2 AND end_date >= $2)
        OR (start_date <= $3 AND end_date >= $3)
        OR (start_date >= $2 AND end_date <= $3)
      );
    `;
    const result = await this.pool.query(query, [rentalId, startDate, endDate]);
    return result.rows[0].count === '0';
  }
}

module.exports = Booking; 