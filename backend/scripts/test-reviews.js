const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testReview = {
  rental_id: 1,
  rating: 5,
  comment: 'Great place to stay! Very clean and comfortable.'
};

const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testReviews() {
  try {
    console.log('🧪 Testing Review Endpoints...\n');

    // Test 1: Get rental reviews (public endpoint)
    console.log('1. Testing GET /reviews/rental/:rentalId');
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/rental/1`);
      console.log('✅ Success:', response.data.success);
      console.log('📊 Reviews count:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 2: Get review stats (public endpoint)
    console.log('\n2. Testing GET /reviews/stats/:itemType/:itemId');
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/stats/rental/1`);
      console.log('✅ Success:', response.data.success);
      console.log('📊 Stats:', response.data.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 3: Get user reviews (public endpoint)
    console.log('\n3. Testing GET /reviews/user/:userId');
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/user/1`);
      console.log('✅ Success:', response.data.success);
      console.log('📊 User reviews count:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 4: Get user average rating (public endpoint)
    console.log('\n4. Testing GET /reviews/user/:userId/rating');
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/user/1/rating`);
      console.log('✅ Success:', response.data.success);
      console.log('📊 User rating:', response.data.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 5: Create review (requires authentication)
    console.log('\n5. Testing POST /reviews (requires auth)');
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, testReview);
      console.log('✅ Success:', response.data.success);
      console.log('📝 Created review ID:', response.data.data?.id);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Expected: Authentication required');
      } else {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Review endpoint tests completed!');
    console.log('\n📝 Note: Some endpoints require authentication.');
    console.log('   To test authenticated endpoints, you need to:');
    console.log('   1. Login to get a JWT token');
    console.log('   2. Include the token in the Authorization header');
    console.log('   3. Test the protected endpoints');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testReviews(); 