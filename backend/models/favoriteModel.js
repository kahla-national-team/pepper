const favoriteModel = {
  // Create favorites table
  createTable: async (pool) => {
    const query = `
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        item_type VARCHAR(10) CHECK (item_type IN ('stay', 'service')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, item_id, item_type),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    try {
      await pool.query(query);
      console.log('Favorites table created or already exists');
    } catch (error) {
      console.error('Error creating favorites table:', error);
      throw error;
    }
  },

  // Add an item to favorites
  addFavorite: async (pool, userId, itemId, itemType) => {
    const query = 'INSERT INTO favorites (user_id, item_id, item_type) VALUES ($1, $2, $3) RETURNING id';
    try {
      const result = await pool.query(query, [userId, itemId, itemType]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  // Remove a favorite by its ID and user ID
  removeFavoriteById: async (pool, favoriteId, userId) => {
    const query = 'DELETE FROM favorites WHERE id = $1 AND user_id = $2';
    try {
      const result = await pool.query(query, [favoriteId, userId]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error removing favorite by ID:', error);
      throw error;
    }
  },

  // Remove an item from favorites
  removeFavorite: async (pool, userId, itemId, itemType) => {
    const query = 'DELETE FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3';
    try {
      const result = await pool.query(query, [userId, itemId, itemType]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  // Get all favorites for a user
  getFavorites: async (pool, userId) => {
    const query = `
      SELECT 
        f.*,
        CASE 
          WHEN f.item_type = 'stay' THEN r.title
          WHEN f.item_type = 'service' THEN cs.name
        END as title,
        CASE 
          WHEN f.item_type = 'stay' THEN r.description
          WHEN f.item_type = 'service' THEN cs.description
        END as description,
        CASE 
          WHEN f.item_type = 'stay' THEN r.price
          WHEN f.item_type = 'service' THEN cs.price
        END as price,
        CASE 
          WHEN f.item_type = 'stay' THEN r.image
          WHEN f.item_type = 'service' THEN cs.photo_url
        END as image,
        u.username as provider_name,
        u.profile_image as provider_image
      FROM favorites f
      LEFT JOIN rentals r ON f.item_type = 'stay' AND f.item_id = r.id
      LEFT JOIN concierge_services cs ON f.item_type = 'service' AND f.item_id = cs.id
      LEFT JOIN users u ON 
        CASE 
          WHEN f.item_type = 'stay' THEN r.owner_id = u.id
          WHEN f.item_type = 'service' THEN cs.owner_id = u.id
        END
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },

  // Check if an item is in favorites
  isFavorite: async (pool, userId, itemId, itemType) => {
    const query = 'SELECT id FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3';
    try {
      const result = await pool.query(query, [userId, itemId, itemType]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw error;
    }
  }
};

module.exports = favoriteModel; 