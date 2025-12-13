import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - handled via requirements
    OpenAI = None  # type: ignore

app = FastAPI(title="GenUI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    """
    Basic health check endpoint for readiness probes and local testing.
    """
    return {"status": "ok"}


@app.get("/api/info", tags=["system"])
def info() -> dict[str, str]:
    """
    Example API route to confirm the stack is working.
    """
    return {"message": "Hello from FastAPI"}


class TravelPlanRequest(BaseModel):
    prompt: str


@app.post("/api/travel-plan")
def travel_plan(body: TravelPlanRequest):
    """
    Proxy endpoint to call OpenAI and return a structured travel plan JSON.
    """
    if OpenAI is None:
        raise HTTPException(status_code=500, detail="OpenAI SDK not installed")

    # api_key = os.getenv("OPENAI_API_KEY")
    api_key = "REDACTED"
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")

    client = OpenAI(api_key=api_key)

    system_prompt = (
        "You are a travel planner. Respond ONLY with JSON matching the TravelUI schema. "
        "If any field is unknown, set it to null or an empty list. "
        "Do not include extra text or code fences."
    )

    user_prompt = (
        f"Generate TravelUI JSON for this request: {body.prompt}\n"
        "Schema:\n"
        "{\n"
        '  "intent": "travel_planning",\n'
        '  "trip": { "from": string|null, "to": string|null, "duration_days": number|null, "travelers": number|null },\n'
        '  "ui": {\n'
        '    "sections": [\n'
        '      {"type": "itinerary", "title": string|null, "days": [{"day": number|null, "location": {"name": string|null, "lat": number|null, "lng": number|null}, "activities": string[]}]},\n'
        '      {"type": "flight_options", "title": string|null, "options": [{"airline": string|null, "from": string|null, "to": string|null, "duration": string|null, "price_estimate": string|null}]},\n'
        '      {"type": "accommodation", "title": string|null, "cities": [{"city": string|null, "nights": number|null, "recommendations": string[]}]},\n'
        '      {"type": "budget", "currency": string|null, "breakdown": Record<string, number|null>},\n'
        '      {"type": "checklist", "title": string|null, "items": string[]},\n'
        '      {"type": "dining", "title": string|null, "spots": [{"name": string|null, "cuisine": string|null, "price": string|null, "address": string|null}]},\n'
        '      {"type": "local_tips", "title": string|null, "tips": string[]},\n'
        '      {"type": "transport", "title": string|null, "passes": [{"name": string|null, "coverage": string|null, "price": string|null}]},\n'
        '      {"type": "documents", "title": string|null, "items": string[]},\n'
        '      {"type": "packing", "title": string|null, "items": string[]}\n'
        "    ]\n"
        "  }\n"
        "}\n"
        "Use best effort defaults; use null when unknown."
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        response_format={"type": "json_object"},
    )

    content = completion.choices[0].message.content
    if not content:
        raise HTTPException(status_code=500, detail="OpenAI returned empty content")

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="OpenAI returned invalid JSON")
