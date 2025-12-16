# Coding Mismatch Example

## Scenario
Patient billed for annual preventive physical but claim processed with patient cost-sharing due to incorrect ICD-10 code.

## Key Details
- **Patient**: James Mitchell, 28M
- **Service**: Annual preventive exam (CPT 99385)
- **ICD-10 Billed**: R51 (Headache) ❌
- **Amount Due**: $285 (should be $0 for preventive)
- **Denial Reason**: Diagnostic code used on preventive visit

## The Coding Error
| What Was Billed | What Should Be Billed |
|----------------|---------------------|
| CPT: 99385 (Preventive visit) ✅ | CPT: 99385 (Preventive visit) ✅ |
| ICD-10: R51 (Headache - diagnostic) ❌ | ICD-10: Z00.00 (Preventive exam) ✅ |

## Why This Matters
Under the Affordable Care Act (ACA):
- Preventive visits coded with **Z codes** = 100% covered, $0 patient cost
- Preventive visits coded with **diagnostic codes** = Deductible/copay applies

## What Actually Happened
Patient came for routine annual physical. During review of systems, he **mentioned** occasional mild headaches (2-3/10, related to screen time). No treatment needed. Visit was preventive, not diagnostic.

## The Billing Mistake
Coder saw "headache" in notes and used R51 as primary diagnosis instead of Z00.00.

## Expected AI Behavior
The AI should:
1. Identify this as a "Coding Mismatch" scenario
2. Use searchICD10Codes to look up R51 and Z00.00
3. Recognize that preventive visits require Z codes as primary diagnosis
4. Explain that headache was incidental mention, not reason for visit
5. Generate appeal with correct code (Z00.00) and rationale

## Run This Example
```bash
npm run scenario:2
```

Or with full paths:
```bash
npm start -- --denial examples/coding-mismatch/denial.txt --notes examples/coding-mismatch/notes.txt
```
