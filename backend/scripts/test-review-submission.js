const axios = require('axios');
const { Pool } = require('pg');

const API_URL = 'http://localhost:5000/api';

// Database connection
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function testReviewSubmission() {
  console.log('Testing Review Submission...\n');

  try {
    // Check if there are any users in the database
    console.log('1. Checking for users in database...');
    const usersResult = await pool.query('SELECT id, full_name FROM users LIMIT 5');
    console.log('Users found:', usersResult.rows.length);
    if (usersResult.rows.length > 0) {
      console.log('Sample users:', usersResult.rows.map(u => `${u.id}: ${u.full_name}`));
    }

    // Check if there are any rentals
    console.log('\n2. Checking for rentals in database...');
    const rentalsResult = await pool.query('SELECT id, title FROM rentals LIMIT 5');
    console.log('Rentals found:', rentalsResult.rows.length);
    if (rentalsResult.rows.length > 0) {
      console.log('Sample rentals:', rentalsResult.rows.map(r => `${r.id}: ${r.title}`));
    }

    // Check current reviews count
    console.log('\n3. Checking current reviews count...');
    const reviewsResult = await pool.query('SELECT COUNT(*) as count FROM reviews');
    console.log('Current reviews count:', reviewsResult.rows[0].count);

    // Test review submission without authentication (should fail)
    console.log('\n4. Testing review submission without authentication...');
    try {
      const response = await axios.post(`${API_URL}/reviews`, {
        rating: 5,
        comment: 'Test review without auth',
        rental_id: 1
      });
      console.log('Unexpected success:', response.data);
    } catch (error) {
      console.log('Expected failure (no auth):', error.response?.status, error.response?.data?.message);
    }

    console.log('\nReview submission test completed!');
    console.log('\nNext steps:');
    console.log('1. Make sure you are logged in to the frontend');
    console.log('2. Try submitting a review through the UI');
    console.log('3. Check the browser network tab for the POST request');
    console.log('4. Check this terminal for backend logs when you submit');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testReviewSubmission(); 