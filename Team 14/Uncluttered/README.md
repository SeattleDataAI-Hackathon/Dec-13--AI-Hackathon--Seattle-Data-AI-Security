# 🧠 Uncluttered - AI Agent for Organizing Your Thoughts

A full-stack application that helps you organize messy thoughts through an intelligent 4-stage AI workflow. Input your "thought dump," and our AI Agent classifies, prioritizes, converts them into actionable items, and guides you through a release ritual for thoughts you want to let go.

## 🎯 What It Does

**Uncluttered** is an AI-powered thought organization system that transforms chaotic thinking into clarity:

1. **Classify** - Categorizes your thoughts into ACTION, FEELING, BELIEF, DECISION, WORRY, IDEA, or OTHER
2. **Prioritize** - Assigns priority levels (HIGH, MEDIUM, LOW) to each thought
3. **Convert to Actions** - Breaks high-priority thoughts into concrete, actionable steps
4. **Release Ritual** - Creates a meaningful ceremony to help you let go of items you don't need

Perfect for:
- Clearing mental clutter
- Organizing scattered ideas into actionable plans
- Processing overwhelming feelings and thoughts
- Creating psychological closure through a guided release process

## � Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite 5.0** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework and REST API
- **Axios** - HTTP client for Ollama communication
- **dotenv** - Environment configuration management

### AI/ML
- **Ollama** - Local LLM inference engine
- **orca-mini** - Default model (2.0GB, 3.4B parameters, CPU-optimized)
- Alternative models: mistral, llama2, neural-chat

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Ollama** - Download from [ollama.ai](https://ollama.ai)
- **npm** package manager

## 🚀 Quick Start

### 1. Install Ollama

Download and install Ollama from [ollama.ai](https://ollama.ai). Then pull the default model:

```bash
# Pull orca-mini (recommended, 2.0GB, CPU-friendly)
ollama pull orca-mini

# Or use other models
ollama pull mistral    # 4.4GB, more capable
ollama pull llama2     # 3.8GB
```

### 2. Start Ollama

```bash
ollama serve
# Ollama will be available at http://localhost:11434
```

### 3. Install Dependencies

From the project root directory:

```bash
npm install
# This installs dependencies for both client and server (npm workspaces)
```

### 4. Configure the Backend

Edit `server/.env`:

```env
OLLAMA_URL=http://localhost:11434
MODEL=orca-mini
PORT=3001
```

### 5. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Uncluttered/
├── .github/
│   └── copilot-instructions.md    # AI development guidelines
├── .vscode/
│   ├── tasks.json                 # VS Code build/run tasks
│   └── launch.json                # Debug configuration
├── client/                         # React frontend (port 5173)
│   ├── src/
│   │   ├── App.jsx                # Main 4-stage workflow component
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Styling & theme
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Vite config with API proxy
├── server/                         # Express backend (port 3001)
│   ├── index.js                   # Main server & API endpoints
│   ├── package.json
│   └── .env                       # Configuration (model, URL, port)
├── package.json                    # Root package.json (npm workspaces)
├── README.md                       # This file
├── GETTING_STARTED.md
└── quick-start.sh
```

### Key Files Explained

**Frontend (`client/src/App.jsx`)**
- Main React component managing the 4-stage workflow
- State: current stage, user thoughts, results for each stage, loading status
- Handles API calls to backend `/api/process-thoughts`
- Responsive UI with navigation between stages

**Backend (`server/index.js`)**
- Express server with 4 main endpoints
- `POST /api/process-thoughts` - Core endpoint handling all 4 workflow stages
- `GET /api/status` - Checks model availability
- `GET /api/models` - Lists available Ollama models
- Configurable via environment variables

**Styling (`client/src/index.css`)**
- Modern purple/amber color scheme
- Gradient backgrounds and smooth animations
- Responsive design for mobile and desktop
- Custom components: stage-container, buttons, progress bar, loading spinner

## 🔧 Configuration & API

### Backend Configuration (`server/.env`)

```env
# Ollama connection
OLLAMA_URL=http://localhost:11434

# AI Model selection
MODEL=orca-mini         # Lightweight, CPU-friendly (default)
                        # Also available: mistral, llama2, neural-chat

# Server port
PORT=3001
```

### API Endpoints

#### Process Thoughts (Main Feature)
```
POST /api/process-thoughts
Content-Type: application/json

{
  "thoughts": "I'm worried about the deadline, need to finish the report, and want to take a break",
  "stage": "classify"   # or: prioritize, convert, release
}
```

Stages in order:
- `classify` - Categorize thoughts
- `prioritize` - Assign priority levels
- `convert` - Create action items
- `release` - Generate release ritual

#### Check Model Status
```
GET /api/status
Response: { status: 'ready', model: 'orca-mini' }
```

#### List Available Models
```
GET /api/models
Response: { models: ['orca-mini', 'mistral', 'llama2', ...] }
```

## 🎨 Customization

### Change the AI Model

Edit `server/.env`:
```env
MODEL=mistral  # Switch to Mistral (more capable, larger)
```

Then restart the server. No code changes needed.

### Adjust AI Response Behavior

In `server/index.js`, find the `/api/process-thoughts` endpoint and modify these parameters:

```javascript
const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
  model: MODEL,
  prompt: finalPrompt,
  stream: false,
  temperature: 0.7,    // 0=precise, 1=creative (adjust here)
  num_predict: 256,    // Max tokens (lower = shorter responses)
  timeout: 300000      // 5 minute timeout
})
```

### Modify System Prompts

Edit the `systemPrompt` for each stage in `server/index.js`:

**Classify stage:**
```javascript
const systemPrompt = `You are a thought categorizer. Analyze each thought and assign ONE category...`
```

Customize the categories, instructions, and output format for each stage.

### Change UI Theme

Edit CSS variables in `client/src/index.css`:

```css
:root {
  --primary: #8b5cf6;      /* Purple */
  --accent: #f59e0b;       /* Amber */
  --success: #10b981;      /* Green */
  --bg-dark: #0f172a;      /* Dark blue */
  --bg-light: #1e293b;     /* Lighter blue */
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Cannot connect to Ollama"** | Ensure Ollama is running (`ollama serve`) and `OLLAMA_URL` in `.env` is correct (default: `http://localhost:11434`) |
| **"Model not found"** | Pull the model: `ollama pull orca-mini` or `ollama pull mistral` |
| **"Port 3001 already in use"** | Change `PORT` in `server/.env` or stop the process using that port |
| **"Port 5173 already in use"** | Modify `vite.config.js` to use a different port or stop the conflicting process |
| **Frontend can't reach backend** | Ensure backend is running on port 3001 and check CORS configuration in `server/index.js` |
| **Slow AI responses** | Try a faster model (`orca-mini` is fastest) or increase `temperature` in the API call |
| **Out of memory errors** | Use `orca-mini` (2GB) instead of `mistral` (4.4GB) or `llama2` (3.8GB) |
| **React compilation errors** | Delete `node_modules` and `package-lock.json`, run `npm install` again |

## 🔮 Future Enhancements

Ideas for extending Uncluttered:

- [ ] Persistent thought journal with history
- [ ] Export thoughts and action plans to PDF
- [ ] Collaborative mode to organize thoughts with others
- [ ] Voice input for hands-free thought dumping
- [ ] Mobile app (React Native) version
- [ ] Different "rituals" for different types of releases
- [ ] Thought tracking over time (personal growth metrics)
- [ ] Integration with calendar/task apps (Todoist, Notion)
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Docker containerization for easy deployment
- [ ] Cloud sync option for accessing thoughts across devices

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Have ideas to improve Uncluttered? Feel free to:
1. Fork the project
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 Tips for Best Results

- **Be honest**: Uncluttered works best when you dump thoughts without filtering
- **Start with classify**: Go through all 4 stages for comprehensive organization
- **Use prioritize to focus**: Not everything is urgent - let the AI help you focus on what matters
- **Trust the process**: The release ritual might feel silly, but it's powerful for letting go
- **Iterate**: You can always restart and process the same thoughts differently

---

**Made with ❤️ to help clear mental clutter**
