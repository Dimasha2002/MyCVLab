const axios = require('axios');

async function testBackendConnectivity() {
  console.log('🔍 Testing Backend Connectivity...\n');
  
  const backendURL = 'http://localhost:5000';
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123456'
  };

  try {
    console.log('1. Testing basic backend health...');
    const healthResponse = await axios.get(`${backendURL}/api/auth/health`, { timeout: 5000 });
    console.log('✅ Backend health check passed');
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
  }

  try {
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${backendURL}/api/auth/register`, testData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Registration successful:', registerResponse.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration failed with response:', error.response.data);
    } else if (error.request) {
      console.log('❌ Registration failed - no response received');
      console.log('Network error:', error.message);
    } else {
      console.log('❌ Registration failed:', error.message);
    }
  }

  try {
    console.log('\n3. Testing CORS preflight...');
    const corsResponse = await axios.options(`${backendURL}/api/auth/register`, {
      timeout: 5000,
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS preflight successful');
  } catch (error) {
    console.log('❌ CORS preflight failed:', error.message);
  }

  console.log('\n📊 Network Test Complete');
}

testBackendConnectivity();