# Claim Crusher 🏥⚡

AI-powered medical billing appeal generator that analyzes claim denials and generates evidence-based appeal letters using Azure OpenAI.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference for running scenarios
- **[SCENARIOS.md](SCENARIOS.md)** - Detailed guide to all test scenarios
- **[examples/](examples/)** - Individual scenario documentation

## Quick Start

```bash
# List all test scenarios
npm run list

# Run any scenario (1-5)
npm run scenario:1   # Medical Necessity
npm run scenario:2   # Coding Mismatch  
npm run scenario:3   # Pre-Authorization
npm run scenario:4   # Bundling/NCCI
npm run scenario:5   # Experimental Treatment

# Use custom files
npm start -- --denial path/to/denial.txt --notes path/to/notes.txt
```

## Features

- **Auto-detects denial scenarios**: Medical Necessity Gap, Coding Mismatch, and more
- **Evidence extraction**: Searches clinical notes for supporting documentation
- **Professional appeal letters**: Generates ready-to-send appeals with specific citations
- **ICD-10/CPT code validation**: Identifies coding errors and suggests corrections

## Prerequisites

- Node.js 18+ installed
- Azure OpenAI resource with deployment
- API credentials (endpoint, key, deployment name)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your Azure OpenAI credentials:
```env
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4
```

## Usage

### 🚀 Quick Start - Run Test Scenarios

The easiest way to test Claim Crusher is with built-in scenarios:

```bash
# List all available scenarios
npm run list

# Run any scenario by number (1-5)
npm run scenario:1    # Medical Necessity
npm run scenario:2    # Coding Mismatch
npm run scenario:3    # Pre-Authorization
npm run scenario:4    # Bundling/NCCI Edits
npm run scenario:5    # Experimental Treatment
```

Or use the `--scenario` flag:

```bash
npm start -- --scenario 1
npm start -- --scenario 2
```

### 📁 Use Custom Files

```bash
npm start -- --denial <denial-letter-path> --notes <clinical-notes-path>
```

### 📄 Specify Output Directory

```bash
npm start -- --scenario 1 --output my-appeals
```

## Output

The tool generates:

1. **Console output** with:
   - Detected scenario
   - Denial reason summary
   - Evidence found in clinical notes
   - Recommended action
   - Complete appeal letter

2. **Output file** (default: `appeal-output.txt`) containing the full analysis and appeal letter ready to send

## Sample Scenarios Included

All example scenarios are organized in the `examples/` folder by type:

### 1. 🏥 Medical Necessity Gap
**Location**: `examples/medical-necessity/`  
**Scenario**: MRI lumbar spine denied for "insufficient conservative treatment"  
**What it demonstrates**: Patient completed 6 weeks PT and 8-week NSAID trial but insurer claims documentation is missing. AI extracts specific evidence from clinical notes proving all requirements were met.  
**Run**: `npm run scenario:1`

### 2. 💊 Coding Mismatch  
**Location**: `examples/coding-mismatch/`  
**Scenario**: Annual preventive exam coded with diagnostic ICD-10 code  
**What it demonstrates**: CPT 99385 (preventive visit) paired with R51 (headache diagnostic code) instead of Z00.00 (preventive exam), triggering patient cost-sharing. AI identifies coding error and suggests correction.  
**Run**: `npm run scenario:2`

### 3. ⏰ Pre-Authorization Issue
**Location**: `examples/pre-authorization/`  
**Scenario**: Rotator cuff surgery denied for late authorization request  
**What it demonstrates**: Authorization submitted 1 day before surgery (not 5 days required), BUT patient had acute clinical deterioration requiring urgent surgery. AI builds appeal based on emergency circumstances.  
**Run**: `npm run scenario:3`

### 4. 🔗 Bundling/NCCI Edits
**Location**: `examples/bundling/`  
**Scenario**: Colonoscopy with biopsies denied as "bundled service"  
**What it demonstrates**: CPT 45378 and 45380 billed together triggering bundling denial. AI must understand CPT hierarchy and correct coding guidelines to address this technical denial.  
**Run**: `npm run scenario:4`

### 5. 🧪 Experimental/Investigational Treatment
**Location**: `examples/experimental/`  
**Scenario**: PRP injections for knee osteoarthritis denied as experimental  
**What it demonstrates**: Patient exhausted ALL standard treatments (NSAIDs, PT, cortisone, hyaluronic acid) and is too young for knee replacement. AI must build nuanced appeal for off-label/investigational treatment based on exceptional circumstances.  
**Run**: `npm run scenario:5`

## How It Works

1. **Ingestion**: Reads denial letter and clinical/encounter notes
2. **Analysis**: Azure OpenAI analyzes both documents using GPT-4
3. **Scenario Detection**: Identifies denial type (medical necessity, coding error, etc.)
4. **Evidence Search**: Extracts specific dates, quotes, and facts from clinical notes
5. **Appeal Generation**: Creates professional appeal letter with citations

## Supported Scenarios

- ✅ **Medical Necessity Gap** - Conservative treatment documentation issues
- ✅ **Coding Mismatch** - ICD-10/CPT pairing errors  
- ✅ **Pre-Authorization** - Timing and urgent clinical situations
- ✅ **Bundling/NCCI Edits** - CPT bundling and coding edit denials
- ✅ **Experimental Treatment** - Investigational procedures with extenuating circumstances

## Development

Run in watch mode:
```bash
npm run dev
```

## Example Folder Structure

```
examples/
├── medical-necessity/
│   ├── denial.txt          # Insurance denial letter
│   ├── notes.txt           # Clinical documentation
│   └── README.md           # Scenario details
├── coding-mismatch/
│   ├── denial.txt
│   ├── notes.txt
│   └── README.md
├── pre-authorization/
│   ├── denial.txt
│   ├── notes.txt
│   └── README.md
├── bundling/
│   ├── denial.txt
│   ├── notes.txt
│   └── README.md
└── experimental/
    ├── denial.txt
    ├── notes.txt
    └── README.md
```

Each scenario folder contains:
- **denial.txt**: Realistic insurance denial letter
- **notes.txt**: Clinical/encounter documentation  
- **README.md**: Explanation of the scenario and what to expect

📖 **For detailed scenario documentation, see [SCENARIOS.md](SCENARIOS.md)**

## Troubleshooting

**Error: Missing required environment variables**
- Make sure `.env` file exists and contains all three Azure OpenAI variables

**Error: Failed to read file**
- Check that file paths are correct and files exist
- Use absolute paths or paths relative to project root

**Error: Azure OpenAI API error**
- Verify your API key and endpoint are correct
- Ensure your deployment name matches an actual deployment in your Azure resource
- Check that you have sufficient quota/credits

## License

MIT

## Hackathon Notes

Built for rapid prototyping - focuses on functionality over UX. For production use, consider adding:
- Web interface
- PDF parsing
- Database for tracking appeals
- Multi-file batch processing
- RAG with full ICD-10/CPT databases
