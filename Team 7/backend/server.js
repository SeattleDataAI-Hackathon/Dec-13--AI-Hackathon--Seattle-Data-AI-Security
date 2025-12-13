const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { generateQuiz, assessKnowledge, generateRoadmap } = require('./services');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Generate Quiz Endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`Generating quiz for topic: ${topic}`);
    const quiz = await generateQuiz(topic);
    
    res.json(quiz);
  } catch (error) {
    console.error('Error in /api/generate-quiz:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      details: error.message,
    });
  }
});

// Assess Knowledge Endpoint
app.post('/api/assess-knowledge', async (req, res) => {
  try {
    const { topic, answers, questions } = req.body;

    if (!topic || answers === undefined || !questions) {
      return res.status(400).json({
        error: 'Topic, answers, and questions are required',
      });
    }

    console.log(`Assessing knowledge for topic: ${topic}`);
    const assessment = await assessKnowledge(topic, answers, questions);
    
    res.json(assessment);
  } catch (error) {
    console.error('Error in /api/assess-knowledge:', error);
    res.status(500).json({
      error: 'Failed to assess knowledge',
      details: error.message,
    });
  }
});

// Generate Roadmap Endpoint
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { topic, timeline, assessmentScore, weakAreas, strongAreas } = req.body;

    if (!topic || !timeline || assessmentScore === undefined) {
      return res.status(400).json({
        error: 'Topic, timeline, and assessmentScore are required',
      });
    }

    console.log(`Generating roadmap for topic: ${topic}`);
    const roadmap = await generateRoadmap(
      topic,
      timeline,
      assessmentScore,
      weakAreas || [],
      strongAreas || []
    );
    
    res.json(roadmap);
  } catch (error) {
    console.error('Error in /api/generate-roadmap:', error);
    res.status(500).json({
      error: 'Failed to generate roadmap',
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 LearnMap.ai Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
