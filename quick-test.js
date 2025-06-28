const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

console.log('Quick test of Germany Prep Hub...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Content length: ${data.length}`);
    console.log(`Has title: ${data.includes('Germany Prep Hub') ? 'YES' : 'NO'}`);
    console.log(`Has dashboard content: ${data.includes('Welcome') || data.includes('Dashboard') ? 'YES' : 'NO'}`);
    
    if (res.statusCode === 200 && data.length > 0) {
      console.log('\n✅ SUCCESS: Application is working!');
    } else {
      console.log('\n❌ ISSUE: Application may not be working correctly');
    }
  });
});

req.on('error', (err) => {
  console.log(`❌ Error: ${err.message}`);
});

req.end(); 