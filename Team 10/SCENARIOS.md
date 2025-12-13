# Test Scenarios Guide

This document provides detailed information about each test scenario included with Claim Crusher.

## Overview

Each scenario represents a real-world denial situation with realistic documentation. They are designed to test different capabilities of the AI appeal generator.

## Running Scenarios

```bash
# List all scenarios
npm run list

# Run by shortcut
npm run scenario:1
npm run scenario:2
npm run scenario:3
npm run scenario:4
npm run scenario:5

# Run by flag
npm start -- --scenario 1
npm start -- --scenario 2

# Use custom files
npm start -- --denial path/to/denial.txt --notes path/to/notes.txt
```

---

## Scenario 1: Medical Necessity Gap

**Difficulty**: ⭐⭐ Moderate  
**Type**: Medical Necessity  
**Command**: `npm run scenario:1`

### The Situation
Insurance denied an MRI claiming "insufficient documentation of conservative treatment," but the patient DID complete all required treatments.

### What to Test
- Can the AI find evidence scattered across multiple clinical notes?
- Does it extract specific dates and provider names?
- Can it quote directly from documentation?
- Does it match insurer requirements point-by-point?

### Expected Output
- Scenario: "Medical Necessity Gap"
- Evidence of 6 weeks PT (12 sessions, specific dates)
- Evidence of 8-week NSAID trial  
- Evidence of persistent symptoms
- Appeal letter citing exact quotes from clinical notes

### Key Success Metrics
✅ Finds all 12 PT sessions with dates  
✅ Identifies 8-week Ibuprofen trial  
✅ Quotes PT discharge summary  
✅ Cites specific provider names (Jane Martinez, PT; Dr. Chen)  
✅ Appeal addresses each denial requirement explicitly

---

## Scenario 2: Coding Mismatch

**Difficulty**: ⭐⭐⭐ Challenging  
**Type**: Coding Error  
**Command**: `npm run scenario:2`

### The Situation
Patient had preventive physical exam but was billed with a diagnostic ICD-10 code (R51 - Headache) instead of preventive code (Z00.00), triggering patient cost-sharing.

### What to Test
- Does the AI use `searchICD10Codes` tool to validate codes?
- Can it distinguish between primary and incidental findings?
- Does it understand ACA preventive care coding rules?
- Can it explain WHY the code is wrong and suggest the correct one?

### Expected Output
- Scenario: "Coding Mismatch"
- Code validation showing R51 as "incorrect"
- Suggested code: Z00.00 with rationale
- Explanation that headache was incidental mention, not reason for visit
- Appeal requesting corrected claim submission

### Key Success Metrics
✅ Searches ICD-10 database for both R51 and Z00.00  
✅ Correctly identifies R51 as inappropriate for preventive visit  
✅ Explains Z00.xx codes are required for preventive visits  
✅ Notes that headache was mentioned in passing, no treatment needed  
✅ Appeal includes correct codes with descriptions

---

## Scenario 3: Pre-Authorization Issue

**Difficulty**: ⭐⭐⭐⭐ Complex  
**Type**: Authorization/Policy  
**Command**: `npm run scenario:3`

### The Situation
Rotator cuff surgery denied because authorization was submitted 1 day before surgery (not 5 days required), BUT patient had emergency clinical deterioration requiring urgent surgery.

### What to Test
- Can the AI identify the timeline conflict?
- Does it recognize urgent vs. elective situations?
- Can it extract ER documentation showing emergency?
- Does it build appeal based on exceptional circumstances?

### Expected Output
- Scenario: "Authorization Issue" or "Other"
- Timeline showing: auth requested 9/18, surgery 9/22, emergency 9/20
- ER documentation of acute complete tear
- Surgeon's rationale for proceeding urgently
- Appeal citing emergency exception to authorization policy

### Key Success Metrics
✅ Identifies timeline: auth late BUT emergency developed  
✅ Extracts ER visit documentation (9/20)  
✅ Quotes "acute complete tear... urgent surgical indication"  
✅ Explains waiting would worsen outcome (retraction)  
✅ Appeal requests exception based on urgent circumstances

---

## Scenario 4: Bundling/NCCI Edits

**Difficulty**: ⭐⭐⭐⭐⭐ Expert  
**Type**: Coding Compliance  
**Command**: `npm run scenario:4`

### The Situation
Colonoscopy with biopsies billed with both CPT 45378 (diagnostic) and 45380 (with biopsy). Insurance denied 45380 as "bundled" into 45378.

### What to Test
- **TRICK QUESTION**: Insurance is actually CORRECT
- Can the AI recognize when a denial is justified?
- Does it understand CPT code hierarchy?
- Will it recommend corrective action instead of appealing?

### Expected Output
- Recognition that this is a coding error, not appealable
- Explanation of CPT hierarchy (45380 replaces 45378)
- Recommendation: Submit corrected claim with only 45380
- Explanation of NCCI bundling rules

### Key Success Metrics
✅ Recognizes insurance denial is CORRECT  
✅ Explains 45380 is comprehensive code that includes 45378  
✅ Recommends corrected claim submission, not appeal  
✅ Explains NCCI bundling logic  
⚠️ **CRITICAL**: Should NOT generate an appeal letter fighting the denial

**NOTE**: This tests whether the AI can identify justified denials and recommend compliance rather than appealing.

---

## Scenario 5: Experimental Treatment

**Difficulty**: ⭐⭐⭐⭐⭐ Expert (Nuanced)  
**Type**: Policy Exclusion  
**Command**: `npm run scenario:5`

### The Situation
PRP injections for knee osteoarthritis denied as "experimental/investigational." Patient exhausted ALL standard treatments and is too young for knee replacement.

### What to Test
- Can the AI acknowledge insurance is technically correct?
- Does it build appeal based on exceptional circumstances?
- Can it handle gray-area/compassionate grounds appeals?
- Does it balance evidence limitations with patient-specific factors?

### Expected Output
- Acknowledgment that PRP is experimental (insurance correct on facts)
- Documentation of ALL failed standard treatments
- Patient age factor (52, too young for replacement)
- Appeal based on exceptional circumstances and lack of alternatives
- Request for coverage exception or compassionate approval

### Key Success Metrics
✅ Acknowledges PRP is experimental/not FDA approved  
✅ Lists ALL failed treatments (NSAIDs, PT, cortisone, HA)  
✅ Emphasizes patient too young for knee replacement  
✅ Notes functional impairment (can't work)  
✅ Builds appeal on exceptional circumstances, not just evidence  
✅ Requests coverage as "bridge therapy" to defer surgery

**NOTE**: This is the hardest scenario - tests nuanced reasoning and compassionate grounds appeals, not just evidence-based arguments.

---

## Difficulty Ratings Explained

⭐ **Easy**: Straightforward scenario with clear documentation  
⭐⭐ **Moderate**: Requires searching multiple notes and extracting specific evidence  
⭐⭐⭐ **Challenging**: Requires tool usage (code searches) and understanding of coding rules  
⭐⭐⭐⭐ **Complex**: Multi-faceted scenario with timeline conflicts or policy exceptions  
⭐⭐⭐⭐⭐ **Expert**: Requires nuanced judgment - knowing when NOT to appeal or appealing on exceptional grounds

---

## Adding Your Own Scenarios

1. Create a new folder in `examples/`:
```bash
mkdir examples/my-scenario
```

2. Add files:
```
examples/my-scenario/
├── denial.txt      # Insurance denial letter
├── notes.txt       # Clinical documentation
└── README.md       # Explanation (optional)
```

3. Run with custom files:
```bash
npm start -- --denial examples/my-scenario/denial.txt --notes examples/my-scenario/notes.txt
```

4. (Optional) Add to `src/scenarios.ts` for shortcut access

---

## Tips for Creating Realistic Test Cases

### Denial Letters Should Include:
- Claim details (patient, date, CPT/ICD codes, amount)
- Specific denial reason (not vague)
- Insurer's requirements/criteria
- Appeal deadline and instructions

### Clinical Notes Should Include:
- Realistic medical documentation (dates, vitals, exam findings)
- Evidence that addresses the denial reason
- Provider names and credentials
- Specific quotes that can be cited in appeals
- Some "red herrings" - extra info the AI must filter out

### Make It Challenging:
- Scatter evidence across multiple notes (not one convenient paragraph)
- Include timeline complexity
- Add ambiguity or judgment calls
- Include information NOT relevant to the denial
- Test edge cases and gray areas

---

## Evaluating AI Performance

Good appeals should:
1. ✅ Identify correct denial scenario type
2. ✅ Extract specific evidence with exact dates
3. ✅ Quote directly from clinical notes (not paraphrase)
4. ✅ Cite provider names and credentials
5. ✅ Use searchICD10Codes tool when codes are mentioned
6. ✅ Address each denial requirement point-by-point
7. ✅ Generate professional, ready-to-send appeal letter
8. ✅ Include specific code descriptions when relevant
9. ✅ Recommend appropriate action (appeal vs. corrected claim)
10. ✅ Use factual, evidence-based language (not emotional)

---

## Common Issues to Watch For

❌ **Paraphrasing instead of quoting**: "Patient did PT" vs. "12 sessions completed" (quote)  
❌ **Vague dates**: "In September" vs. "September 19, 2024"  
❌ **Missing provider attribution**: "Notes show..." vs. "Jane Martinez, PT, DPT noted..."  
❌ **Not using tools**: Mentioning codes without searching database  
❌ **Overly confident**: Appealing when denial is actually correct  
❌ **Weak rationale**: "Code is more appropriate" vs. "Z00.00 is required for preventive visits per ACA guidelines"

---

## Next Steps

- Run all 5 scenarios to establish baseline performance
- Review appeal outputs for quality and accuracy
- Test with your own real-world denial cases
- Adjust prompts if consistent issues appear
- Consider adding more scenarios for edge cases
