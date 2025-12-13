const http = require('http');

// Test quiz generation
const data = JSON.stringify({
  topic: 'JavaScript'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/generate-quiz',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
