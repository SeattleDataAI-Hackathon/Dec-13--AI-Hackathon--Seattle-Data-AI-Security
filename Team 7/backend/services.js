const { invokeGoogleModel } = require('./google-ai');
const { mockGenerateQuiz, mockAssessKnowledge, mockGenerateRoadmap } = require('./mock-data');

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

const generateQuiz = async (topic) => {
  // Use mock data for testing
  if (USE_MOCK_DATA) {
    console.log('[MOCK MODE] Generating quiz for:', topic);
    return mockGenerateQuiz(topic);
  }

  const prompt = `Generate a 5-question quiz to assess someone's knowledge of "${topic}". 
  
  Return ONLY a valid JSON object with this exact structure:
  {
    "questions": [
      {
        "id": 1,
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "type": "multiple-choice"
      }
    ]
  }
  
  Make sure the questions range from basic to intermediate level.`;

  try {
    const response = await invokeGoogleModel(prompt);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

const assessKnowledge = async (topic, answers, questions) => {
  // Use mock data for testing
  if (USE_MOCK_DATA) {
    console.log('[MOCK MODE] Assessing knowledge for:', topic);
    return mockAssessKnowledge();
  }

  const questionsText = questions
    .map((q, idx) => `Q${idx + 1}: ${q.question}\nCorrect: ${q.options[0]}`)
    .join('\n');

  const answersText = Object.entries(answers)
    .map(([idx, optIdx]) => `Q${parseInt(idx) + 1}: ${questions[idx].options[optIdx]}`)
    .join('\n');

  const prompt = `You are an expert knowledge assessor. Evaluate this person's knowledge of "${topic}".

Quiz Questions:
${questionsText}

User's Answers:
${answersText}

Analyze the answers and provide:
1. Total score (out of 5)
2. Percentage score
3. List of 2-3 weak areas they need to focus on
4. List of 2-3 strong areas they already know

Return ONLY a valid JSON object with this exact structure:
{
  "score": 3,
  "totalQuestions": 5,
  "percentage": 60,
  "weakAreas": ["area1", "area2"],
  "strongAreas": ["area1", "area2"]
}`;

  try {
    const response = await invokeGoogleModel(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    const assessmentData = JSON.parse(jsonMatch[0]);
    return assessmentData;
  } catch (error) {
    console.error('Error assessing knowledge:', error);
    throw error;
  }
};

const generateRoadmap = async (topic, timeline, assessmentScore, weakAreas, strongAreas) => {
  // Use mock data for testing
  if (USE_MOCK_DATA) {
    console.log('[MOCK MODE] Generating roadmap for:', topic);
    return mockGenerateRoadmap(topic, timeline, assessmentScore, weakAreas);
  }

  const prompt = `Create a personalized learning roadmap for someone learning "${topic}".

Context:
- Timeline: ${timeline}
- Current assessment score: ${assessmentScore}%
- Weak areas: ${weakAreas.join(', ')}
- Strong areas: ${strongAreas.join(', ')}

Generate a detailed roadmap with 5-7 learning steps. Prioritize the weak areas. For each step, include 3-4 real, specific resources that actually exist.

For resources, include a mix of:
- FREE resources: Official documentation, YouTube tutorials, free courses, blogs, open-source projects
- PREMIUM resources: Paid courses (Udemy, Coursera, Pluralsight), books, paid platforms

For each resource, provide:
- Real titles of actual courses/books/tutorials (e.g., "The Complete Python Bootcamp" by Jose Portilla on Udemy, not generic "Python course")
- Real URLs when possible
- Accurate descriptions
- Correct resource type

Return ONLY a valid JSON object with this exact structure:
{
  "topic": "${topic}",
  "timeline": "${timeline}",
  "assessmentScore": ${assessmentScore},
  "summary": "A comprehensive overview of the learning path",
  "focusAreas": ["area1", "area2"],
  "steps": [
    {
      "title": "Step title",
      "description": "What to learn in this step",
      "estimatedTime": "1-2 weeks",
      "resources": [
        {
          "title": "Exact name of real resource",
          "type": "tutorial|course|book|documentation|video",
          "description": "What this specific resource teaches and why it's valuable",
          "isPremium": false,
          "url": "https://example.com"
        }
      ]
    }
  ]
}`;

  try {
    const response = await invokeGoogleModel(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    const roadmapData = JSON.parse(jsonMatch[0]);
    return roadmapData;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
};

module.exports = {
  generateQuiz,
  assessKnowledge,
  generateRoadmap,
};
