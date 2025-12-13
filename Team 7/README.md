# LearnMap.ai - AI-Powered Learning Roadmap Generator

A modern React frontend for LearnMap.ai, an intelligent learning platform that generates personalized learning roadmaps based on your topic, timeline, and current knowledge level.

## Features

- **Interactive Input Form** - Select what you want to learn, your timeline, and starting knowledge level
- **AI-Generated Roadmaps** - Personalized learning paths created by an AI backend
- **Step-by-Step Guidance** - Clear learning steps with descriptions and resources
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Beautiful UI** - Modern gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd LearnMap.ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## How to Use

1. **Enter Topic** - Type the subject or skill you want to learn
2. **Select Timeline** - Choose how long you want to dedicate to learning (1 week to 1 year)
3. **Set Knowledge Level** - Select your current expertise (Beginner, Intermediate, or Advanced)
4. **Generate Roadmap** - Click the button to get your AI-powered learning plan
5. **Follow the Steps** - Work through each step at your own pace with provided resources

## Architecture

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with gradients and animations

### Backend Integration
The frontend connects to a backend API endpoint at `/api/generate-roadmap` that should:

**Request:**
```json
{
  "topic": "string",
  "timeline": "string (1week|2weeks|1month|3months|6months|1year)",
  "startingKnowledge": "string (beginner|intermediate|advanced)"
}
```

**Response:**
```json
{
  "topic": "string",
  "timeline": "string",
  "startingKnowledge": "string",
  "summary": "string",
  "steps": [
    {
      "title": "string",
      "description": "string",
      "resources": ["string"],
      "estimatedTime": "string"
    }
  ]
}
```

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Technologies Used

- React 18.2
- TypeScript 5.2
- Vite 5.0
- CSS3 with Flexbox and Grid

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # React entry point
├── index.css        # Global styles
vite.config.ts       # Vite configuration
tsconfig.json        # TypeScript configuration
index.html           # HTML entry point
package.json         # Project dependencies
```

## Future Enhancements

- Integration with popular learning platforms (Udemy, Coursera, etc.)
- Progress tracking and completion status
- User accounts and saved roadmaps
- Community roadmap sharing
- Mobile app versions
- Advanced filtering and customization options

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
