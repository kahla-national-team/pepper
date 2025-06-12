class Rental {
  constructor(pool) {
    this.pool = pool;
  }

  async findAllActive() {
    const { rows } = await this.pool.query(
      `SELECT * FROM rentals
       WHERE is_active = true AND is_available = true
       ORDER BY created_at DESC`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM rentals
       WHERE id = $1 AND is_active = true`,
      [id]
    );
    return rows[0];
  }

  async getPriceById(id) {
    const { rows } = await this.pool.query(
      `SELECT id, price FROM rentals
       WHERE id = $1 AND is_active = true`,
      [id]
    );
    console.log('Price query result:', rows[0]);
    return rows[0];
  }

  async create(data) {
    const cols = [
      'owner_id','title','description','address','city',
      'price','max_guests','bedrooms','beds','bathrooms',
      'rating','reviews','image','latitude','longitude',
      'amenities','room_type','available_dates','renting_term'
    ];
    const vals = cols.map((c, i) => `$${i+1}`);

    const values = cols.map(key => {
      if (key === 'available_dates') return JSON.stringify(data[key] || []);
      return data[key] || null;
    });

    const query = `
      INSERT INTO rentals (${cols.join(',')})
      VALUES (${vals.join(',')})
      RETURNING *
    `;

    const { rows } = await this.pool.query(query, values);
    return rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, val] of Object.entries(data)) {
      const column = key;
      const value = key === 'available_dates' ? JSON.stringify(val) : val;
      fields.push(`${column} = $${idx}`);
      values.push(value);
      idx++;
    }
    values.push(id);

    const query = `
      UPDATE rentals
      SET ${fields.join(',')}, updated_at = now()
      WHERE id = $${idx} AND is_active = true
      RETURNING *
    `;

    const { rows } = await this.pool.query(query, values);
    return rows[0];
  }

  async deactivate(id) {
    const { rows } = await this.pool.query(
      `UPDATE rentals
       SET is_active = false, updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Rental;
