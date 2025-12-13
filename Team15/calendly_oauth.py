# calendly_oauth.py
import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Query

load_dotenv("secrets.env")

app = FastAPI()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv(" CLIENT_SECRET")

REDIRECT_URI = "http://localhost:8000/calendly/oauth/callback"

@app.get("/calendly/oauth/callback")
def oauth_callback(code: str = Query(...)):
    resp = requests.post(
        "https://auth.calendly.com/oauth/token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
            "redirect_uri": REDIRECT_URI
        }
    )

    if resp.status_code != 200:
        return {
            "error": resp.text,
            "status_code": resp.status_code
        }

    return resp.json()
