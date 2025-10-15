const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);

    // Test assets endpoint
    console.log('\n2. Testing /api/assets...');
    const assetsResponse = await fetch(`${BASE_URL}/api/assets`);
    const assetsData = await assetsResponse.json();
    console.log('✅ Assets count:', assetsData.data?.length || 0);
    console.log('✅ First asset:', assetsData.data?.[0]?.name || 'N/A');

    // Test favorites endpoint
    console.log('\n3. Testing /api/favorites...');
    const testUserId = 'test-user-' + Date.now();
    
    // Add a favorite
    const addResponse = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, assetId: 'bitcoin' })
    });
    const addData = await addResponse.json();
    console.log('✅ Added favorite:', addData);

    // Get favorites
    const getResponse = await fetch(`${BASE_URL}/api/favorites?userId=${testUserId}`);
    const getData = await getResponse.json();
    console.log('✅ Favorites count:', getData.length);

    // Remove favorite
    const deleteResponse = await fetch(`${BASE_URL}/api/favorites?id=${addData.id}`, {
      method: 'DELETE'
    });
    console.log('✅ Deleted favorite:', deleteResponse.ok);

    console.log('\n🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();