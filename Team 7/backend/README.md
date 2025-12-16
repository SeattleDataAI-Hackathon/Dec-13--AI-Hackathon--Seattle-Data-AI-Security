# LearnMap.ai Backend - AWS Bedrock Integration

This is the backend server for LearnMap.ai that integrates with AWS Bedrock to generate personalized learning roadmaps.

## Setup Instructions

### 1. Get AWS Credentials

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **IAM** → **Users** → **Create User**
3. Give it a name and create access key
4. Attach policy: `AmazonBedrockFullAccess`
5. Copy the **Access Key ID** and **Secret Access Key**

### 2. Enable Bedrock Models

1. In AWS Console, go to **Bedrock** → **Model access**
2. Click **Manage model access**
3. Enable **Claude 3 Sonnet** (or your preferred model)
4. Submit access request (usually instant)

### 3. Configure Environment Variables

Edit `backend/.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### 4. Run the Backend

```bash
cd backend
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### POST /api/generate-quiz
Generates a knowledge assessment quiz

**Request:**
```json
{
  "topic": "Machine Learning"
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is machine learning?",
      "options": ["A", "B", "C", "D"],
      "type": "multiple-choice"
    }
  ]
}
```

### POST /api/assess-knowledge
Evaluates quiz answers and identifies weak/strong areas

**Request:**
```json
{
  "topic": "Machine Learning",
  "answers": { "0": 0, "1": 2, "2": 1, "3": 0, "4": 3 },
  "questions": [...]
}
```

**Response:**
```json
{
  "score": 3,
  "totalQuestions": 5,
  "percentage": 60,
  "weakAreas": ["Neural Networks", "Deep Learning"],
  "strongAreas": ["Basics", "Supervised Learning"]
}
```

### POST /api/generate-roadmap
Creates a personalized learning roadmap

**Request:**
```json
{
  "topic": "Machine Learning",
  "timeline": "3months",
  "assessmentScore": 60,
  "weakAreas": ["Neural Networks", "Deep Learning"],
  "strongAreas": ["Basics", "Supervised Learning"]
}
```

**Response:**
```json
{
  "topic": "Machine Learning",
  "timeline": "3months",
  "assessmentScore": 60,
  "summary": "Based on your assessment...",
  "focusAreas": ["Neural Networks", "Deep Learning"],
  "steps": [
    {
      "title": "Step 1: Foundations",
      "description": "Learn the basics...",
      "resources": ["Course link", "Book link"],
      "estimatedTime": "1-2 weeks"
    }
  ]
}
```

## Troubleshooting

**"Invalid credentials"**
- Check AWS Access Key and Secret Key are correct
- Ensure IAM user has `AmazonBedrockFullAccess` policy

**"Model not found"**
- Enable model access in Bedrock console
- Check region matches AWS_REGION in .env

**CORS errors**
- Backend CORS is enabled for all origins
- Make sure backend is running on port 5000

## Technology Stack

- **Express.js** - Web framework
- **AWS Bedrock** - AI model access
- **Claude 3 Sonnet** - LLM model
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables
