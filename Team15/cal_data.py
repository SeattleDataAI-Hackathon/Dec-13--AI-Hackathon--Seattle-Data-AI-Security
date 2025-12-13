import os
import json
from datetime import datetime, timedelta
import pytz
from dotenv import load_dotenv
from openai import OpenAI

from calendly_scheduler import get_availability, create_booking

# -------------------------------------------------
# Environment
# -------------------------------------------------

load_dotenv("secrets.env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set")

client = OpenAI(api_key=OPENAI_API_KEY)
MODEL_NAME = "gpt-4.1"

# -------------------------------------------------
# Intent configuration
# -------------------------------------------------

INTENT_ALIASES = {
    "book_appointment": "book_service",
    "schedule_appointment": "book_service",
}

CRITICAL_PARAMS_BY_INTENT = {
    "book_service": [
        "provider_name",
        "preferred_datetime",
        "duration_minutes",
        "mode",
    ]
}

DEFAULTS = {
    "mode": "online",
}

# -------------------------------------------------
# Provider registry
# -------------------------------------------------

PROVIDER_REGISTRY = {
    "Dr. X": {
        "event_type_uri": "https://api.calendly.com/event_types/34e2c1ea-3b99-4eb0-867e-6aa0e3375566",
        "timezone": "America/Los_Angeles",
        "duration_minutes": 30,
    }
}


def resolve_provider(provider_name: str):
    return PROVIDER_REGISTRY.get(provider_name)


# -------------------------------------------------
# OpenAI helpers
# -------------------------------------------------

def extract_text_from_response(response):
    for item in response.output:
        if item.type == "message":
            for content in item.content:
                if content.type == "output_text":
                    return content.text
        if item.type == "output_text":
            return item.content[0].text
    return None


def extract_intent_from_text(user_text: str, current_datetime: str, timezone: str) -> dict:
    prompt = f"""
You are an intent extraction system.

CURRENT CONTEXT:
- Current datetime: {current_datetime}
- Timezone: {timezone}

Return ONLY valid JSON with this exact structure:

{{
  "intent": {{ "name": string, "confidence": number }},
  "parameters": {{
    "service_type": string | null,
    "provider_name": string | null,
    "preferred_datetime": string | null,
    "time_window": {{ "start": string, "end": string }} | null,
    "duration_minutes": number | null,
    "mode": "online" | "in_person" | null
  }},
  "assumptions": string[]
}}

Rules:
- Resolve relative dates
- preferred_datetime MUST be ISO-8301 with timezone
- Do not invent values

User text:
\"\"\"{user_text}\"\"\"
"""

    response = client.responses.create(
        model=MODEL_NAME,
        input=prompt,
    )

    raw_text = extract_text_from_response(response)
    if not raw_text:
        raise RuntimeError("No text output from OpenAI")

    return json.loads(raw_text)


# -------------------------------------------------
# Processing helpers
# -------------------------------------------------

def normalize_intent_name(intent_name: str) -> str:
    return INTENT_ALIASES.get(intent_name, intent_name)


def apply_defaults(parameters: dict) -> list:
    assumptions = []
    for key, value in DEFAULTS.items():
        if parameters.get(key) is None:
            parameters[key] = value
            assumptions.append(f"Defaulted {key} to {value}")
    return assumptions


def find_missing_critical(intent_name: str, parameters: dict) -> list:
    critical = CRITICAL_PARAMS_BY_INTENT.get(intent_name, [])
    return [p for p in critical if parameters.get(p) is None]


# -------------------------------------------------
# Calendly orchestration
# -------------------------------------------------

def find_available_slot(parameters: dict) -> dict | None:
    provider = resolve_provider(parameters["provider_name"])
    if not provider:
        raise RuntimeError("Unknown provider")

    slots = get_availability(
        event_type_uri=provider["event_type_uri"],
        start_utc=parameters["preferred_datetime"],
        hours=6,
        invitee_timezone=provider["timezone"],
    )

    if not slots:
        return None

    start_utc = datetime.fromisoformat(slots[0]["start_time"].replace("Z", "+00:00"))
    end_utc = start_utc + timedelta(minutes=provider["duration_minutes"])

    tz = pytz.timezone(provider["timezone"])

    return {
        "start_time_utc": start_utc.isoformat(),
        "end_time_utc": end_utc.isoformat(),
        "start_time_local": start_utc.astimezone(tz).isoformat(),
        "end_time_local": end_utc.astimezone(tz).isoformat(),
    }


def book_slot(parameters: dict, availability: dict) -> dict:
    provider = resolve_provider(parameters["provider_name"])

    return create_booking(
        event_type_uri=provider["event_type_uri"],
        start_time_utc=availability["start_time_utc"],
        invitee_name="Calendar User",
        invitee_email="user@example.com",
        invitee_timezone=provider["timezone"],
    )


# -------------------------------------------------
# Orchestrator
# -------------------------------------------------

def process_text_input(user_text: str, timezone: str = "America/Los_Angeles") -> dict:
    tz = pytz.timezone(timezone)
    now_iso = datetime.now(tz).isoformat()

    extraction = extract_intent_from_text(
        user_text=user_text,
        current_datetime=now_iso,
        timezone=timezone,
    )

    intent_name = normalize_intent_name(extraction["intent"]["name"])
    extraction["intent"]["name"] = intent_name

    parameters = extraction["parameters"]
    assumptions = extraction.get("assumptions", [])

    assumptions.extend(apply_defaults(parameters))

    provider = resolve_provider(parameters.get("provider_name"))
    if provider:
        parameters["duration_minutes"] = provider["duration_minutes"]
        assumptions.append("Aligned duration to provider default")

    missing = find_missing_critical(intent_name, parameters)

    availability = None
    booking = None

    if not missing:
        availability = find_available_slot(parameters)
        if availability:
            booking = book_slot(parameters, availability)

    return {
        "intent": extraction["intent"],
        "parameters": parameters,
        "missing_critical": missing,
        "availability": availability,
        "booking": booking,
        "assumptions": assumptions,
    }


# -------------------------------------------------
# Demo
# -------------------------------------------------

if __name__ == "__main__":
    text = "I want to book a therapy session with Dr. X at 8 pm tomorrow."
    result = process_text_input(text)
    print(json.dumps(result, indent=2))
