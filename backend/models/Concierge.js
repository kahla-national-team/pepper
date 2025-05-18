const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

class Concierge {
    static async create(conciergeData) {
        const { owner_id, name, category, description, price, duration_minutes } = conciergeData;
        const query = {
            text: 'INSERT INTO concierge_services (owner_id, name, category, description, price, duration_minutes, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            values: [owner_id, name, category, description, price, duration_minutes]
        };

        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const result = await pool.query('SELECT cs.*, u.username as owner_name FROM concierge_services cs LEFT JOIN users u ON cs.owner_id = u.id WHERE cs.is_active = true ORDER BY cs.created_at DESC');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query('SELECT cs.*, u.username as owner_name FROM concierge_services cs LEFT JOIN users u ON cs.owner_id = u.id WHERE cs.id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByOwnerId(ownerId) {
        try {
            const result = await pool.query('SELECT * FROM concierge_services WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        const { name, category, description, price, duration_minutes, is_active } = updateData;
        const query = {
            text: 'UPDATE concierge_services SET name = $1, category = $2, description = $3, price = $4, duration_minutes = $5, is_active = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
            values: [name, category, description, price, duration_minutes, is_active, id]
        };

        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query('DELETE FROM concierge_services WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Concierge;