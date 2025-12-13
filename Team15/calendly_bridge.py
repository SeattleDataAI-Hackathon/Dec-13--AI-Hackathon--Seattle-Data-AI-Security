from cal_data import process_text_input
from providers import resolve_provider
from calendly_links import build_calendly_booking_url

def create_calendly_redirect(user_text: str):
    structured = process_text_input(user_text)

    provider_name = structured["parameters"]["provider_name"]
    provider = resolve_provider(provider_name)

    if not provider:
        raise ValueError("Unknown provider")

    booking_url = build_calendly_booking_url(
        provider["event_type_url"],
        structured["parameters"]
    )

    return booking_url