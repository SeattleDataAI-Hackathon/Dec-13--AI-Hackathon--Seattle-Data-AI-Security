const { invokeGoogleModel } = require('./google-ai');
const { mockGenerateQuiz, mockAssessKnowledge, mockGenerateRoadmap } = require('./mock-data');

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

const generateQuiz = async (topic) => {
  // Use mock data for testing
  if (USE_MOCK_DATA) {
    console.log('[MOCK MODE] Generating quiz for:', topic);
    return mockGenerateQuiz(topic);
  }

  const prompt = `You are an expert educator. Generate a comprehensive 10-question quiz to assess someone's practical knowledge of "${topic}". 

IMPORTANT - Keep questions SIMPLE and BEGINNER-FRIENDLY:
1. Focus on fundamental concepts
2. Use everyday language, avoid jargon
3. Make questions about common, practical use cases
4. Include at least 3-4 questions for absolute beginners
5. Progress slowly from easy (Q1-Q3) to moderate (Q4-Q10)
6. Avoid trick questions or complex scenarios

The quiz should:
1. Test real-world understanding and application, not just definitions
2. Progress from foundational to intermediate difficulty (but keep it simple!)
3. Cover key concepts, practical skills, and common challenges
4. Include realistic scenarios where applicable
5. Ensure exactly ONE correct answer per question

For each question:
- Make it specific and relevant to ${topic}
- Include 4 distinct options with only 1 clear correct answer
- Avoid trick questions or ambiguous wording
- Use simple language that beginners can understand
- Focus on competency assessment at beginner to intermediate level

Examples of GOOD simple questions:
- "What does [basic concept] do?" (not "What are the edge cases of...")
- "Which is true about [common use]?" (not "In what obscure scenario...")
- "How do you [basic task]?" (not "What's the performance implication of...")

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Clear, simple, beginner-friendly question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "type": "multiple-choice",
      "correctAnswer": 0
    },
    ...
  ]
}

CRITICAL: Ensure correctAnswer is 0-3 and matches one of the options exactly.`;

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
    return mockAssessKnowledge(answers, questions);
  }

  const questionsText = questions
    .map((q, idx) => `Q${idx + 1}: ${q.question}\nCorrect answer: ${q.options[q.correctAnswer] || q.options[0]}`)
    .join('\n');

  const answersText = Object.entries(answers)
    .map(([idx, optIdx]) => {
      if (optIdx === null || optIdx === undefined) {
        return `Q${parseInt(idx) + 1}: (Not answered - "I don't know")`;
      }
      return `Q${parseInt(idx) + 1}: ${questions[idx].options[optIdx]}`;
    })
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

  const prompt = `You are an expert learning path designer. Create a comprehensive, personalized learning roadmap for someone learning "${topic}".

Context:
- Timeline: ${timeline}
- Assessment Score: ${assessmentScore}%
- Weak Areas to Focus On: ${weakAreas.join(', ')}
- Strong Areas to Build On: ${strongAreas.join(', ')}

Create 5-7 detailed learning steps that:
1. Start with fundamentals if score is low (<60%)
2. Prioritize weak areas identified in assessment
3. Include specific, real resources (not generic)
4. Mix FREE and PREMIUM resources appropriately
5. Include estimated time for each step
6. Progress from beginner to advanced concepts

For EACH step, provide 3-4 REAL, SPECIFIC learning resources:
- Use actual course names, book titles, platform names
- Include real YouTube channels, documentation, tutorials
- Specify platform (Udemy, Coursera, GitHub, YouTube, official docs, etc.)
- For books: Include author names where applicable
- For courses: Include instructor/platform names
- Only include resources that actually exist

Example good resources:
- "The Complete Python Bootcamp" by Jose Portilla on Udemy
- "Python Official Documentation" at python.org
- "Corey Schafer's Python Tutorials" on YouTube
- "Introduction to Computation and Programming Using Python" by Guttag

Return ONLY valid JSON with this structure:
{
  "topic": "${topic}",
  "timeline": "${timeline}",
  "assessmentScore": ${assessmentScore},
  "summary": "Brief overview of personalized roadmap based on assessment",
  "focusAreas": ["area1", "area2", "area3"],
  "steps": [
    {
      "id": 1,
      "title": "Clear Step Title",
      "description": "What learner will accomplish in this step",
      "estimatedTime": "1-2 weeks",
      "keyTopics": ["topic1", "topic2", "topic3"],
      "resources": [
        {
          "title": "Exact real resource name",
          "type": "course|tutorial|book|documentation|video|interactive",
          "description": "Why this resource is valuable for this step",
          "creator": "Author/Instructor/Platform name",
          "isPremium": false,
          "url": "Real URL if available"
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
