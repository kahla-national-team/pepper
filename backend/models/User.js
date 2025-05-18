const bcrypt = require('bcryptjs');

class User {
  constructor(pool) {
    this.pool = pool;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async create({ username, full_name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, full_name, email, password)
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, full_name, email, created_at;
    `;
    const values = [username, full_name, email, hashedPassword];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT id, username, full_name, email, created_at FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, full_name, email, created_at FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User; 