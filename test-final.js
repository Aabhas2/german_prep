const http = require('http');

console.log('Testing Germany Prep Hub application...');

// Function to test a URL
async function testUrl(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`${path} - Status Code: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const hasContent = data.length > 0;
        const hasTitle = data.includes('Germany Prep Hub');
        console.log(`${path} - Has content: ${hasContent ? 'YES' : 'NO'}`);
        console.log(`${path} - Has title: ${hasTitle ? 'YES' : 'NO'}`);
        resolve({ path, success: res.statusCode === 200 && hasContent && hasTitle });
      });
    });

    req.on('error', (err) => {
      console.log(`${path} - Error: ${err.message}`);
      reject(err);
    });

    req.end();
  });
}

// Test all routes
async function runTests() {
  const routes = [
    '/',
    '/universities',
    '/exams',
    '/tasks',
    '/notes',
    '/scholarships',
    '/visa',
    '/finance',
    '/settings'
  ];

  try {
    const results = await Promise.all(routes.map(testUrl));
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    console.log('\n=== Test Results ===');
    console.log(`✅ Successful routes: ${successCount}/${routes.length}`);
    console.log(`❌ Failed routes: ${failCount}`);
    
    if (failCount === 0) {
      console.log('\n🎉 SUCCESS: All routes are working correctly!');
      console.log('Your application is ready for deployment.');
    } else {
      console.log('\n⚠️ WARNING: Some routes are not working correctly.');
      console.log('Failed routes:');
      results.filter(r => !r.success).forEach(r => console.log(`- ${r.path}`));
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests(); 