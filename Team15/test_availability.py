import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
from dateutil import tz

# -------------------------------------------------
# Load environment variables
# -------------------------------------------------

load_dotenv("secrets.env")

CALENDLY_ACCESS_TOKEN = os.getenv("CALENDLY_ACCESS_TOKEN")
if not CALENDLY_ACCESS_TOKEN:
    raise RuntimeError("CALENDLY_ACCESS_TOKEN is not set")

CALENDLY_API_BASE = "https://api.calendly.com"

# -------------------------------------------------
# Test configuration
# -------------------------------------------------

# MUST be full event type URI
EVENT_TYPE_URI = (
    "https://api.calendly.com/event_types/"
    "34e2c1ea-3b99-4eb0-867e-6aa0e3375566"
)

# MUST be a future UTC timestamp
START_TIME_UTC = "2025-12-15T02:00:00Z"

# Event duration (from Calendly event type)
EVENT_DURATION_MINUTES = 60

# Invitee display timezone
INVITEE_TIMEZONE = "America/Los_Angeles"
LOCAL_TZ = tz.gettz(INVITEE_TIMEZONE)

# -------------------------------------------------
# Helpers
# -------------------------------------------------

def get_headers() -> dict:
    return {
        "Authorization": f"Bearer {CALENDLY_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


def get_availability(
    event_type_uri: str,
    start_utc: str,
    hours: int = 4,
    invitee_timezone: str = "UTC",
) -> list[dict]:
    start = datetime.fromisoformat(start_utc.replace("Z", "+00:00"))
    end = start + timedelta(hours=hours)

    params = {
        "event_type": event_type_uri,
        "start_time": start.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "end_time": end.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "invitee_timezone": invitee_timezone,
    }

    resp = requests.get(
        f"{CALENDLY_API_BASE}/event_type_available_times",
        headers=get_headers(),
        params=params,
    )

    if resp.status_code != 200:
        print("Calendly availability error:")
        print(resp.text)

    resp.raise_for_status()
    return resp.json()["collection"]


# -------------------------------------------------
# Test runner
# -------------------------------------------------

if __name__ == "__main__":
    print("Testing Calendly availability...\n")

    slots = get_availability(
        event_type_uri=EVENT_TYPE_URI,
        start_utc=START_TIME_UTC,
        hours=6,
        invitee_timezone=INVITEE_TIMEZONE,
    )

    print(f"Slots found: {len(slots)}\n")

    if not slots:
        print("⚠️ No slots found (this is still success).")
    else:
        print("Available time slots:\n")

        for idx, slot in enumerate(slots[:5], start=1):
            start_utc = datetime.fromisoformat(
                slot["start_time"].replace("Z", "+00:00")
            )
            end_utc = start_utc + timedelta(minutes=EVENT_DURATION_MINUTES)

            start_local = start_utc.astimezone(LOCAL_TZ)
            end_local = end_utc.astimezone(LOCAL_TZ)

            print(
                f"{idx}. "
                f"{start_local.strftime('%A, %b %d')} | "
                f"{start_local.strftime('%I:%M %p')} – "
                f"{end_local.strftime('%I:%M %p')} "
                f"({INVITEE_TIMEZONE})"
            )

        print("\n✅ Availability query successful.")
