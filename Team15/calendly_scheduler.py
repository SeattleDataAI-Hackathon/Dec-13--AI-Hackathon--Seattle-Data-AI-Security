import os
import requests
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from urllib.parse import urlencode

# -------------------------------------------------
# Environment
# -------------------------------------------------

load_dotenv("secrets.env")

CALENDLY_API_BASE = "https://api.calendly.com"
CALENDLY_ACCESS_TOKEN = os.getenv("CALENDLY_ACCESS_TOKEN")

if not CALENDLY_ACCESS_TOKEN:
    raise RuntimeError("CALENDLY_ACCESS_TOKEN is not set")


# -------------------------------------------------
# Helpers
# -------------------------------------------------

def _get_headers() -> dict:
    return {
        "Authorization": f"Bearer {CALENDLY_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


# -------------------------------------------------
# Core API functions
# -------------------------------------------------

def get_current_user() -> dict:
    resp = requests.get(
        f"{CALENDLY_API_BASE}/users/me",
        headers=_get_headers(),
    )
    resp.raise_for_status()
    return resp.json()["resource"]


def list_event_types(user_uri: str) -> list[dict]:
    resp = requests.get(
        f"{CALENDLY_API_BASE}/event_types",
        headers=_get_headers(),
        params={"user": user_uri},
    )
    resp.raise_for_status()
    return resp.json()["collection"]


def get_availability(
    event_type_uri: str,
    start_utc: str,
    hours: int = 4,
    invitee_timezone: str = "UTC",
) -> list[dict]:
    """
    Returns a list of available start times.
    Calendly availability slots contain ONLY start_time.
    """

    start = datetime.fromisoformat(start_utc.replace("Z", "+00:00"))
    end = start + timedelta(hours=hours)

    params = {
        "event_type": event_type_uri,
        "start_time": start.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "end_time": end.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "invitee_timezone": invitee_timezone,
    }

    resp = requests.get(
        f"{CALENDLY_API_BASE}/event_type_available_times",
        headers=_get_headers(),
        params=params,
    )

    resp.raise_for_status()
    return resp.json()["collection"]


# def create_booking(
#     event_type_uri: str,
#     start_time_utc: str,
#     invitee_name: str,
#     invitee_email: str,
#     invitee_timezone: str,
# ) -> dict:
#     """
#     Create a scheduled event using Calendly AI Scheduling API.

#     Reference:
#     https://developer.calendly.com/schedule-events-with-ai-agents
#     """

#     payload = {
#         "event_type": event_type_uri,
#         "start_time": start_time_utc.replace("+00:00", "Z"),
#         "invitee": {
#             "name": invitee_name,
#             "email": invitee_email,
#             "timezone": invitee_timezone,
#         },
#     }

#     resp = requests.post(
#         f"{CALENDLY_API_BASE}/scheduled_events",
#         headers=_get_headers(),
#         json=payload,
#     )

#     if resp.status_code not in (200, 201):
#         raise RuntimeError(
#             f"Calendly booking failed: {resp.status_code} {resp.text}"
#         )

#     return resp.json()["resource"]


def create_booking(
    event_type_uri: str,
    start_time_utc: str,
    invitee_name: str,
    invitee_email: str,
    invitee_timezone: str,
) -> dict:
    """
    Attempt AI-agent booking.
    Fallback to redirect URL if AI scheduling is not enabled.
    """

    payload = {
        "event_type": event_type_uri,
        "start_time": start_time_utc.replace("+00:00", "Z"),
        "invitee": {
            "name": invitee_name,
            "email": invitee_email,
            "timezone": invitee_timezone,
        },
    }

    resp = requests.post(
        f"{CALENDLY_API_BASE}/scheduled_events",
        headers=_get_headers(),
        json=payload,
    )

    # ✅ AI scheduling not enabled → fallback
    if resp.status_code == 404:
        params = urlencode({
            "name": invitee_name,
            "email": invitee_email,
        })

        return {
            "booking_type": "redirect",
            "booking_url": f"https://calendly.com/doca-apt/therapy-session?{params}",
            "reason": "AI scheduling not enabled for this app",
        }

    if resp.status_code not in (200, 201):
        raise RuntimeError(
            f"Calendly booking failed: {resp.status_code} {resp.text}"
        )

    return {
        "booking_type": "api",
        "scheduled_event": resp.json()["resource"],
    }