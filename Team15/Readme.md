# Calendar-Driven AI Scheduling Agent

This project demonstrates an **AI agent that turns natural language scheduling requests into real calendar bookings**.

Instead of manually navigating booking websites, users can express intent in plain English (for example, *“Book a therapy session with Dr. X at 8 pm tomorrow”*). The agent:

1. Understands the intent and extracts structured parameters
2. Checks real provider availability via Calendly
3. Selects an appropriate time slot
4. Creates a booking (or falls back to a redirect when required)

The system is designed to work naturally with **calendar-centric users** (Google Calendar / Apple Calendar–first workflows).

---

## High-level Architecture

```

User Text
↓
LLM (Intent & Parameter Extraction)
↓
Structured Intent
↓
Provider Resolution
↓
Calendly Availability API
↓
Slot Selection
↓
Booking (API or Redirect)

```

---

## Key Features

- Natural language intent parsing using OpenAI
- Structured parameter extraction (time, provider, duration, mode)
- Real-time availability lookup using Calendly APIs
- Timezone-aware scheduling
- Automatic fallback when API booking is not enabled
- Modular, testable Python design

---

## Project Structure

```

.
├── cal_data.py
│   ├── LLM intent extraction
│   ├── Parameter normalization
│   ├── Availability orchestration
│   └── Booking orchestration
│
├── calendly_scheduler.py
│   ├── Calendly authentication
│   ├── Availability queries
│   └── Booking creation (AI-agent compliant with fallback)
│
├── test_availability.py
│   └── Standalone availability inspection and slot enrichment
│
├── secrets.env
│   └── Environment variables (not committed)
│
└── README.md

````

---

## Prerequisites

- Python 3.10+
- Calendly account with at least one active event type
- OpenAI API key
- Internet access

---

## Environment Variables

Create a file called `secrets.env`:

```env
OPENAI_API_KEY=your_openai_key
CALENDLY_ACCESS_TOKEN=your_calendly_oauth_token
````

> Do **not** commit this file. Add it to `.gitignore`.

---

## Installation

Create and activate a virtual environment:

```bash
python -m venv myenv
source myenv/bin/activate
```

Install dependencies:

```bash
pip install requests python-dotenv pytz openai
```

---

## Running the Project

### 1. Test Calendly availability

This verifies that your Calendly setup and access token work correctly.

```bash
python test_availability.py
```

Expected output includes:

* Number of available slots
* Human-readable local time ranges

---

### 2. Run the AI scheduling pipeline

```bash
python cal_data.py
```

Example input (hardcoded for demo):

```text
I want to book a therapy session with Dr. X at 8 pm tomorrow.
```

Example output (simplified):

```json
{
  "intent": { "name": "book_service", "confidence": 0.98 },
  "availability": {
    "start_time_local": "2025-12-14T20:00:00-08:00",
    "end_time_local": "2025-12-14T21:00:00-08:00"
  },
  "booking": {
    "booking_type": "redirect",
    "booking_url": "https://calendly.com/..."
  }
}
```

---

## Booking Behavior

Calendly currently supports **AI-agent scheduling** only for approved applications.

This project handles both cases:

| Scenario                  | Behavior                                   |
| ------------------------- | ------------------------------------------ |
| AI scheduling enabled     | Books directly via API                     |
| AI scheduling not enabled | Returns a pre-filled Calendly booking link |

This reflects real-world constraints and ensures the agent always produces a usable outcome.

---

## Why This Design

* **Calendar-first UX**: Users think in time, not forms
* **Agent-friendly**: Each step produces structured, inspectable output
* **Resilient**: Graceful fallbacks instead of hard failures
* **Hackathon-ready**: Clear demo flow and realistic constraints

---

## Limitations (By Design)

* Payments-enabled event types require redirect booking
* Team/round-robin events may require additional host resolution
* Availability reflects connected external calendars only

These are platform constraints, not implementation issues.

---

## Future Improvements

* Webhook handling for booking lifecycle events
* Multi-provider routing
* Availability alerts
* Payment-aware decisioning
* Google Calendar write-back

---

## Summary

This project demonstrates how AI agents can move beyond chat and into **real operational workflows**, bridging natural language, calendars, and scheduling systems in a practical, extensible way.

```

---

If you want, I can also:
- Shorten this for a **hackathon submission**
- Add a **“Demo Script” section**
- Add **architecture diagrams**
- Tailor it for GitHub vs Devpost

Just tell me where you’re submitting it.
```
