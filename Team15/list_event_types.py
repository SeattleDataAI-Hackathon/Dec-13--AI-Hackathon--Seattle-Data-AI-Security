import os
import requests
from dotenv import load_dotenv

load_dotenv("secrets.env")

headers = {
    "Authorization": f"Bearer {os.getenv('CALENDLY_ACCESS_TOKEN')}"
}

resp = requests.get(
    "https://api.calendly.com/users/me",
    headers=headers
)

resp.raise_for_status()

user_uri = resp.json()["resource"]["uri"]
print("User URI:", user_uri)

resp = requests.get(
    "https://api.calendly.com/event_types",
    headers=headers,
    params={"user": user_uri}
)
resp.raise_for_status()

for ev in resp.json()["collection"]:
    print("Name:", ev["name"])
    print("URI:", ev["uri"])
    print("Duration:", ev["duration"])
    print("Active:", ev["active"])
    print("-" * 40)
