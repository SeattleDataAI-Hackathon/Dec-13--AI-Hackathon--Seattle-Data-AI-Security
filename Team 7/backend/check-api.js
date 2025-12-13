require('dotenv').config();
const https = require('https');

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔍 Testing Google Generative Language API access...');
console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(-10)}\n`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [
    {
      parts: [
        {
          text: "Say 'API Access Successful' in one sentence"
        }
      ]
    }
  ]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}\n`);

    if (res.statusCode === 200) {
      console.log('✅ SUCCESS! Your API key has access to Generative Language API');
      const response = JSON.parse(responseData);
      const text = response.candidates[0].content.parts[0].text;
      console.log(`\nResponse from Gemini:\n"${text}"`);
    } else if (res.statusCode === 404) {
      console.log('❌ Model not found. The Generative Language API might not be enabled yet.');
      console.log('   Please wait 15-30 minutes after enabling the API in Google Cloud Console.');
    } else if (res.statusCode === 403) {
      console.log('❌ Access denied. Your API key does not have permission.');
      console.log('   Check that "Generative Language API" is enabled in your Google Cloud project.');
    } else if (res.statusCode === 400) {
      console.log('❌ Bad request. The API key format might be incorrect.');
      console.log(`Response: ${responseData}`);
    } else {
      console.log(`❌ Error: ${res.statusCode}`);
      console.log(`Response: ${responseData}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network error:', error.message);
});

req.write(data);
req.end();
