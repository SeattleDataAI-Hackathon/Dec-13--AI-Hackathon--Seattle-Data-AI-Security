require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const listModels = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('Model created successfully');
    console.log('Testing with gemini-pro...');
    
    const result = await model.generateContent('Hello');
    console.log('Success! gemini-pro works');
  } catch (error) {
    console.error('Error with gemini-pro:', error.message);
    
    // Try other models
    const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro-vision'];
    for (const modelName of models) {
      try {
        console.log(`\nTrying ${modelName}...`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        const testResult = await testModel.generateContent('Hello');
        console.log(`✓ ${modelName} works!`);
        return;
      } catch (err) {
        console.log(`✗ ${modelName} failed: ${err.message.split('\n')[0]}`);
      }
    }
  }
};

listModels();

