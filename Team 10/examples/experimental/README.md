# Experimental/Investigational Treatment Example

## Scenario
PRP (Platelet-Rich Plasma) injections for knee osteoarthritis denied as "experimental/investigational" treatment not covered by insurance.

## Key Details
- **Patient**: Jennifer Taylor, 52F
- **Service**: Bilateral PRP injections for knee OA (CPT 0232T x2)
- **Billed Amount**: $1,800
- **Denial Reason**: Experimental/investigational - insufficient evidence, not FDA approved
- **Challenge**: Patient exhausted all standard treatments

## Insurance Position
Per Cigna Medical Director's denial:
- ❌ Insufficient high-quality evidence for PRP in knee OA
- ❌ No FDA approval for this specific indication
- ❌ AAOS gives "inconclusive" recommendation  
- ❌ No standardized protocols
- ✅ Covered alternatives available (PT, NSAIDs, cortisone, HA, knee replacement)

## Patient's Clinical Journey

**Treatments Attempted (ALL FAILED):**

1. **NSAIDs** - Ibuprofen → Meloxicam (8+ months, minimal relief)
2. **Physical Therapy** - 8 weeks, 2x/week (modest improvement only)
3. **Weight Loss** - Lost 8 lbs, BMI improvement (symptoms persisted)
4. **Cortisone Injections** - Bilateral knees (6 weeks relief, then back to baseline)
5. **Hyaluronic Acid** - Full series, bilateral (minimal improvement)

**The Dilemma:**
- Patient is only 52 years old
- Too young for total knee replacement (typically done 60+)
- Moderate-severe OA (Kellgren-Lawrence Grade 3)
- Retail manager - can't work due to pain
- Desperate to avoid surgery

## The Gray Area
PRP for knee OA is controversial:
- ✅ Some studies show benefit
- ❌ Other studies show no benefit vs. placebo
- ❌ Not standardized (different protocols)
- ❌ Not FDA-approved for this use
- ⚠️ BUT: Low risk (patient's own blood)

## What Makes This Appealable?
- **Exceptional circumstances**: Too young for knee replacement
- **Failed standard care**: Exhausted ALL covered alternatives
- **Functional impairment**: Unable to work, significant disability
- **Conservative approach**: Trying to defer major surgery
- **Informed decision**: Patient understood experimental nature, paid out-of-pocket

## Expected AI Behavior
This is the **hardest** scenario. The AI must:

1. Acknowledge insurance is technically correct (PRP is experimental)
2. Recognize this is **not a winnable appeal** based solely on evidence
3. Build appeal based on **exceptional circumstances** and **compassionate grounds**:
   - Patient's age (too young for replacement)
   - Exhaustive trial of all standard treatments
   - Functional disability affecting livelihood
   - No other reasonable alternatives available
4. Cite precedent for coverage exceptions in unusual cases
5. Request coverage as **bridge therapy** to defer replacement surgery
6. Acknowledge limited evidence but emphasize patient-specific factors

**This tests nuanced reasoning** - knowing when to appeal based on extenuating circumstances rather than black-and-white medical necessity.

## Run This Example
```bash
npm run scenario:5
```

Or with full paths:
```bash
npm start -- --denial examples/experimental/denial.txt --notes examples/experimental/notes.txt
```
