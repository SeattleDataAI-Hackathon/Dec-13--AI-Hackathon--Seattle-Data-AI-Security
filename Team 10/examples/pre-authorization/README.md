# Pre-Authorization Issue Example

## Scenario
Rotator cuff surgery denied because authorization was submitted 1 day before surgery (not 5 business days required), BUT patient had urgent clinical deterioration requiring immediate surgery.

## Key Details
- **Patient**: Maria Rodriguez, 56F
- **Service**: Arthroscopic rotator cuff repair (CPT 29827)
- **Billed Amount**: $18,450
- **Denial Reason**: Authorization required 5 days prior - only submitted 1 day prior
- **Complication**: Policy requirement vs. urgent medical need

## Timeline
- **9/18**: Surgery scheduled for 9/22 (4 days away)
- **9/18 4:30 PM**: Authorization submitted (1 business day before surgery)
- **9/20 AM**: Patient fell, partial tear became **complete tear** (emergency)
- **9/20 PM**: ER visit confirmed acute complete tear
- **9/22**: Surgery performed as scheduled (now urgent indication)
- **9/24**: Authorization approved (after surgery already done)

## The Dilemma
- Insurance policy: 5 business days notice required ✅
- Clinical reality: Acute complete tear requires urgent surgery ⚡
- Waiting longer = worse surgical outcome (increased retraction)

## What the Medical Records Show
- Patient had known high-grade partial tear (scheduled for elective surgery)
- **Emergency on 9/20**: Mechanical fall → acute complete tear → loss of function
- ER documentation: "acute complete tear... urgent surgical indication"
- Surgeon note: "Given acute complete tear, proceeding with surgery. Waiting longer risks further retraction"

## Expected AI Behavior
The AI should:
1. Identify this as "Authorization Issue" scenario
2. Recognize the timeline conflict
3. Extract ER documentation showing urgent clinical change
4. Find surgeon's rationale for proceeding without waiting
5. Build appeal based on **exception for urgent/emergency circumstances**
6. Cite policy exceptions for situations where delay would harm patient

## Run This Example
```bash
npm run scenario:3
```

Or with full paths:
```bash
npm start -- --denial examples/pre-authorization/denial.txt --notes examples/pre-authorization/notes.txt
```
