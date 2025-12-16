# 🚀 Quick Reference Guide

## Running Test Scenarios

```bash
# List all scenarios
npm run list

# Run scenarios by number
npm run scenario:1    # Medical Necessity Gap
npm run scenario:2    # Coding Mismatch
npm run scenario:3    # Pre-Authorization Issue
npm run scenario:4    # Bundling/NCCI Edits
npm run scenario:5    # Experimental Treatment

# Or use the --scenario flag
npm start -- --scenario 1
npm start -- --scenario 3

# Custom files
npm start -- --denial path/to/denial.txt --notes path/to/notes.txt
```

## What Each Scenario Tests

| # | Scenario | Difficulty | Tests |
|---|----------|-----------|-------|
| 1 | Medical Necessity | ⭐⭐ | Evidence extraction, quote extraction, timeline analysis |
| 2 | Coding Mismatch | ⭐⭐⭐ | ICD-10 code search, coding rules, preventive vs diagnostic |
| 3 | Pre-Authorization | ⭐⭐⭐⭐ | Timeline conflicts, urgent vs elective, exception handling |
| 4 | Bundling/NCCI | ⭐⭐⭐⭐⭐ | Recognizing CORRECT denials, CPT hierarchy, compliance |
| 5 | Experimental | ⭐⭐⭐⭐⭐ | Nuanced reasoning, exceptional circumstances, compassionate appeals |

## Output Files

After running, check the `output/` folder:
- `appeal-YYYY-MM-DD.txt` - Full appeal analysis and letter
- `logs-YYYY-MM-DD.txt` - Agent activity logs (tool calls, searches, etc.)

## Project Structure

```
claim-crusher/
├── examples/              # Test scenarios
│   ├── medical-necessity/
│   ├── coding-mismatch/
│   ├── pre-authorization/
│   ├── bundling/
│   └── experimental/
├── output/               # Generated appeals
├── src/
│   ├── index.ts         # CLI entry point
│   ├── agent.ts         # AI agent logic
│   ├── prompts.ts       # System prompts
│   ├── scenarios.ts     # Scenario definitions
│   ├── tools.ts         # ICD-10 search tool
│   └── types.ts         # TypeScript types
├── README.md            # Main documentation
├── SCENARIOS.md         # Detailed scenario guide
└── QUICKSTART.md        # This file
```

## Common Commands

```bash
# Install dependencies
npm install

# Configure Azure OpenAI (edit .env file)
cp .env.example .env

# List available scenarios
npm run list

# Run a scenario
npm run scenario:1

# Watch mode (for development)
npm run dev
```

## What Makes a Good Appeal?

✅ Identifies correct denial scenario  
✅ Uses searchICD10Codes tool for code validation  
✅ Extracts specific evidence with exact dates  
✅ Quotes directly from clinical notes  
✅ Cites provider names and credentials  
✅ Addresses each denial requirement point-by-point  
✅ Professional, factual tone  
✅ Ready-to-send format  

## Evaluating Output Quality

Check that the appeal includes:
1. **Specific dates**: "September 19, 2024" not "in September"
2. **Direct quotes**: "Patient has completed 12 sessions..." (quoted verbatim)
3. **Provider attribution**: "Jane Martinez, PT, DPT noted..."
4. **Code searches**: Tool calls logged for any codes mentioned
5. **Evidence for each requirement**: Point-by-point response to denial criteria

## Troubleshooting

**"Missing environment variables"**
→ Copy `.env.example` to `.env` and add your Azure OpenAI credentials

**"Failed to read file"**
→ Check file paths - use scenario shortcuts or verify paths are correct

**"Max iterations reached"**
→ The AI is searching too many times - check if ICD-10 database is loaded correctly

**Appeal seems generic/vague**
→ Check if clinical notes contain specific evidence - AI can only work with what's documented

## Next Steps

1. ✅ Run all 5 scenarios to see different denial types
2. ✅ Review output quality and appeal letters
3. ✅ Read [SCENARIOS.md](SCENARIOS.md) for detailed scenario explanations
4. ✅ Try creating your own test cases
5. ✅ Check `output/logs-*.txt` to see how the agent searched and reasoned

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🎯 Detailed scenarios: [SCENARIOS.md](SCENARIOS.md)
- 📁 Example READMEs in each `examples/*/README.md` folder
