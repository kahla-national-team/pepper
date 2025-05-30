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
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async ensureTableSchema() {
    try {
      // Check if full_name column exists
      const checkFullNameQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'full_name';
      `;
      const fullNameResult = await this.pool.query(checkFullNameQuery);
      
      if (fullNameResult.rows.length === 0) {
        // Add full_name column if it doesn't exist
        const addFullNameQuery = `
          ALTER TABLE users 
          ADD COLUMN full_name VARCHAR(100) NOT NULL DEFAULT 'User';
        `;
        await this.pool.query(addFullNameQuery);
        console.log('Added full_name column to users table');
      }

      // Check if profile_image column exists
      const checkProfileImageQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'profile_image';
      `;
      const profileImageResult = await this.pool.query(checkProfileImageQuery);
      
      if (profileImageResult.rows.length === 0) {
        // Add profile_image column if it doesn't exist
        const addProfileImageQuery = `
          ALTER TABLE users 
          ADD COLUMN profile_image VARCHAR(255);
        `;
        await this.pool.query(addProfileImageQuery);
        console.log('Added profile_image column to users table');
      }
    } catch (error) {
      console.error('Error ensuring table schema:', error);
      throw error;
    }
  }

  async create({ username, full_name, email, password }) {
    await this.ensureTableSchema();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, full_name, email, password)
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, full_name, email, profile_image, created_at;
    `;
    const values = [username, full_name, email, hashedPassword];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email) {
    await this.ensureTableSchema();
    const query = 'SELECT id, username, full_name, email, profile_image, created_at FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    await this.ensureTableSchema();
    const query = 'SELECT id, username, full_name, email, profile_image, created_at FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async updateProfileImage(userId, imageUrl) {
    await this.ensureTableSchema();
    const query = `
      UPDATE users 
      SET profile_image = $1 
      WHERE id = $2 
      RETURNING id, username, full_name, email, profile_image, created_at;
    `;
    const result = await this.pool.query(query, [imageUrl, userId]);
    return result.rows[0];
  }

  async updateProfile(userId, { full_name }) {
    await this.ensureTableSchema();
    const query = `
      UPDATE users 
      SET full_name = $1 
      WHERE id = $2 
      RETURNING id, username, full_name, email, profile_image, created_at;
    `;
    const result = await this.pool.query(query, [full_name, userId]);
    return result.rows[0];
  }

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  async findByEmailOrUsername(identifier) {
    await this.ensureTableSchema();
    const query = 'SELECT * FROM users WHERE email = $1 OR username = $1';
    const result = await this.pool.query(query, [identifier]);
    return result.rows[0];
  }
}

module.exports = User; 