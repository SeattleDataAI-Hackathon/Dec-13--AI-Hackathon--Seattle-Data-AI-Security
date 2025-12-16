# Medical Necessity Gap Example

## Scenario
Insurance denied MRI lumbar spine claiming "insufficient documentation of conservative treatment."

## Key Details
- **Patient**: Sarah Johnson, 42F
- **Service**: MRI lumbar spine (CPT 72148)
- **Billed Amount**: $2,450
- **Denial Reason**: Medical necessity not met - lack of documented conservative care

## Insurance Requirements
Per denial letter, insurance requires:
- ✅ Minimum 6 weeks of physical therapy
- ✅ NSAID trial documentation  
- ✅ Evidence of persistent symptoms despite conservative care

## What the Clinical Notes Show
The patient **DID** complete all requirements:
- **Physical Therapy**: 12 sessions over 6 weeks (8/22/24 - 9/19/24)
- **NSAID Trial**: Ibuprofen 600mg TID for 8 weeks
- **Persistent Symptoms**: Pain 5/10 despite treatment, positive SLR test unchanged

## The Problem
Documentation exists but wasn't properly highlighted in initial claim submission.

## Expected AI Behavior
The AI should:
1. Identify this as a "Medical Necessity Gap" scenario
2. Search clinical notes for evidence of PT completion
3. Find specific quotes about NSAID trial
4. Extract evidence of persistent symptoms
5. Generate appeal citing exact dates, provider names, and direct quotes from notes

## Run This Example
```bash
npm run scenario:1
```

Or with full paths:
```bash
npm start -- --denial examples/medical-necessity/denial.txt --notes examples/medical-necessity/notes.txt
```
