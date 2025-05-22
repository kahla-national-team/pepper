class Property {
  constructor(pool) {
    this.pool = pool;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS rentals (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id),
        title VARCHAR(150) NOT NULL,
        description TEXT,
        address TEXT NOT NULL,
        city VARCHAR(100),
        price NUMERIC(10,2) NOT NULL,
        max_guests INTEGER DEFAULT 1,
        bedrooms INTEGER,
        beds INTEGER,
        bathrooms INTEGER,
        rating NUMERIC(2,1),
        reviews INTEGER,
        image TEXT,
        latitude NUMERIC(9,6),
        longitude NUMERIC(9,6),
        amenities TEXT[],
        room_type VARCHAR(50),
        available_dates JSONB,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        renting_term VARCHAR(20) DEFAULT 'night_term',
        is_favorite BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true
      );
    `;
    await this.pool.query(query);
  }

  async create(propertyData) {
    const {
      owner_id,
      title,
      description,
      address,
      city,
      price,
      max_guests,
      bedrooms,
      beds,
      bathrooms,
      room_type,
      amenities,
      latitude,
      longitude,
      image,
      renting_term
    } = propertyData;

    const query = `
      INSERT INTO rentals (
        owner_id, title, description, address, city, price,
        max_guests, bedrooms, beds, bathrooms, room_type,
        amenities, latitude, longitude, image, renting_term
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const values = [
      owner_id,
      title,
      description,
      address,
      city,
      price,
      max_guests,
      bedrooms,
      beds,
      bathrooms,
      room_type,
      amenities,
      latitude,
      longitude,
      image,
      renting_term
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM rentals WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async findByOwnerId(ownerId) {
    const query = 'SELECT * FROM rentals WHERE owner_id = $1';
    const result = await this.pool.query(query, [ownerId]);
    return result.rows;
  }

  async update(id, propertyData) {
    const setClause = Object.keys(propertyData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE rentals
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const values = [id, ...Object.values(propertyData)];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM rentals WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Property; 