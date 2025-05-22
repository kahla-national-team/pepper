

const pool = require('../config/db'); // افترض أن لديك ملف إعداد الاتصال بـ DB

// إنشاء عقار جديد
async function createRental(data) {
  const {
    owner_id, title, description, address, city, price, max_guests,
    bedrooms, beds, bathrooms, rating, reviews, image, latitude,
    longitude, amenities, room_type, available_dates, is_available,
    renting_term
  } = data;

  const query = `
    INSERT INTO rentals (
      owner_id, title, description, address, city, price, max_guests,
      bedrooms, beds, bathrooms, rating, reviews, image, latitude,
      longitude, amenities, room_type, available_dates, is_available,
      renting_term
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *;
  `;

  const values = [
    owner_id, title, description, address, city, price, max_guests,
    bedrooms, beds, bathrooms, rating, reviews, image, latitude,
    longitude, amenities, room_type, available_dates, is_available,
    renting_term
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// جلب جميع العقارات
async function getAllRentals() {
  const result = await pool.query('SELECT * FROM rentals ORDER BY created_at DESC;');
  return result.rows;
}

// جلب عقار معين بالمعرف
async function getRentalById(id) {
  const result = await pool.query('SELECT * FROM rentals WHERE id = $1;', [id]);
  return result.rows[0];
}

// تحديث عقار
async function updateRental(id, data) {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

  const query = `UPDATE rentals SET ${setClause}, updated_at = now() WHERE id = $${fields.length + 1} RETURNING *;`;
  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
}

// حذف عقار
async function deleteRental(id) {
  await pool.query('DELETE FROM rentals WHERE id = $1;', [id]);
}

module.exports = {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteRental,
};
