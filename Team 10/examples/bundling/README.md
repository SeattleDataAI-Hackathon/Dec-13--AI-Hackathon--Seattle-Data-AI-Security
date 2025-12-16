# Bundling/NCCI Edits Example

## Scenario
Colonoscopy with biopsies denied because insurance considers the biopsy code "bundled" into the base colonoscopy code.

## Key Details
- **Patient**: David Chen, 65M
- **Service**: Screening colonoscopy with biopsies
- **CPT Codes Billed**: 45378 (diagnostic colonoscopy) + 45380 (colonoscopy with biopsy)
- **Denial**: 45380 denied as "bundled/incidental" to 45378
- **Issue**: Coding hierarchy confusion

## The Coding Problem

**What was billed:**
- CPT 45378: Diagnostic colonoscopy → PAID ✅
- CPT 45380: Colonoscopy with biopsy → DENIED ❌ (bundled)

**What should have been billed:**
- CPT 45380 ONLY (replaces 45378 when biopsies are taken)

## Why This is Confusing

Provider logic:
- "We did a diagnostic colonoscopy AND took biopsies"
- "That's two services, so we bill both codes"

**WRONG** ❌

CPT hierarchy logic:
- 45378 = colonoscopy, no biopsy/intervention
- 45380 = colonoscopy WITH biopsy (more comprehensive, **replaces** 45378)
- You bill the **higher-level code only**, not both

## NCCI (National Correct Coding Initiative) Rules
CMS coding edits state:
- 45380 is the "comprehensive" code
- 45378 is the "component" code  
- Component is **bundled into** comprehensive
- Billing both = duplicate payment for same procedure

## What Actually Happened
- Complete colonoscopy to cecum performed ✅
- 3 polyps found and biopsied ✅
- Specimens sent to pathology ✅
- **Coding error**: Billed both 45378 and 45380 instead of just 45380

## Expected AI Behavior
This is **tricky** - the AI must understand:
1. This is a "Bundling/NCCI Edit" denial (not actually appealing the denial)
2. Insurance is **correct** - this is improper coding
3. The solution is **corrected claim submission**, not an appeal
4. Should recommend: Submit corrected claim with only CPT 45380, remove 45378
5. Explain CPT hierarchy and why both codes can't be billed together

**NOTE**: This tests whether the AI can recognize when a denial is **justified** and recommend corrective action rather than appealing.

## Run This Example
```bash
npm run scenario:4
```

Or with full paths:
```bash
npm start -- --denial examples/bundling/denial.txt --notes examples/bundling/notes.txt
```
