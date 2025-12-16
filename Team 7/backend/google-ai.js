require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const invokeGoogleModel = async (prompt) => {
  try {
    // Use the latest available model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response from Google Gemini');
    }
    
    return text;
  } catch (error) {
    // Fallback to an older model if the new one doesn't work
    if (error.message.includes('not found')) {
      console.log('Trying fallback model: gemini-1.5-pro');
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (fallbackError) {
        console.error('Google Gemini Fallback Error:', fallbackError.message);
        throw fallbackError;
      }
    }
    console.error('Google Gemini Error:', error.message);
    throw error;
  }
};

module.exports = { invokeGoogleModel };
