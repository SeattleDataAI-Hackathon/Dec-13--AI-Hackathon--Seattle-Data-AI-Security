import streamlit as st
import os
from datetime import datetime, timedelta
from collections import defaultdict
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import pandas as pd
import openai

# -------------------------
# OpenAI API Setup
# -------------------------
# Set your OpenAI API key as environment variable or directly here
# os.environ["OPENAI_API_KEY"] = "your_api_key_here"
openai.api_key = os.getenv("OPENAI_API_KEY")

# -------------------------
# OAuth Scopes
# -------------------------
SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/tasks"
]

# -------------------------
# Google Calendar Service
# -------------------------
def get_calendar_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json", SCOPES
        )
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    service = build("calendar", "v3", credentials=creds)
    return service

def fetch_events(days=7):
    service = get_calendar_service()
    now = datetime.utcnow()
    start_time = (now - timedelta(days=days)).isoformat() + "Z"
    end_time = now.isoformat() + "Z"
    events_result = service.events().list(
        calendarId='primary',
        timeMin=start_time,
        timeMax=end_time,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    return events_result.get('items', [])

# -------------------------
# Google Tasks Service
# -------------------------
def get_tasks_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json", SCOPES
        )
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    service = build("tasks", "v1", credentials=creds)
    return service

def fetch_tasks(max_results=50):
    service = get_tasks_service()
    tasklists_result = service.tasklists().list(maxResults=1).execute()
    tasklists = tasklists_result.get('items', [])
    if not tasklists:
        return []
    tasklist_id = tasklists[0]['id']
    tasks_result = service.tasks().list(tasklist=tasklist_id, maxResults=max_results).execute()
    return tasks_result.get('items', [])

# -------------------------
# Summarize Calendar & Tasks
# -------------------------
def summarize_calendar(events):
    total_minutes = 0
    titles_count = defaultdict(int)
    daily_minutes = defaultdict(int)
    for event in events:
        start = event['start'].get('dateTime')
        end = event['end'].get('dateTime')
        title = event.get('summary', 'No title')
        if start and end:
            start_dt = datetime.fromisoformat(start.replace('Z',''))
            end_dt = datetime.fromisoformat(end.replace('Z',''))
            duration = (end_dt - start_dt).total_seconds() / 60
            total_minutes += duration
            day = start_dt.strftime("%Y-%m-%d")
            daily_minutes[day] += duration
        titles_count[title] += 1
    return total_minutes, daily_minutes, titles_count

def summarize_tasks(tasks):
    total = len(tasks)
    completed = sum(1 for t in tasks if t.get('status') == 'completed')
    overdue = sum(1 for t in tasks if t.get('status') != 'completed' and t.get('due') and datetime.fromisoformat(t['due'].replace('Z','')) < datetime.utcnow())
    return total, completed, overdue

# -------------------------
# LLM Analysis with OpenAI ≥1.0
# -------------------------
def llm_analysis(calendar_summary, tasks_summary):
    calendar_total, daily_minutes, titles_count = calendar_summary
    tasks_total, tasks_completed, tasks_overdue = tasks_summary

    prompt = f"""
You are an AI productivity coach. Analyze the following user data and give actionable suggestions for focus, time management, and task completion:

Calendar:
- Total minutes scheduled: {calendar_total}
- Daily minutes per day: {daily_minutes}
- Most frequent events: {dict(titles_count)}

Tasks:
- Total tasks: {tasks_total}
- Completed tasks: {tasks_completed}
- Overdue tasks: {tasks_overdue}

Provide a concise summary with recommendations to help the user improve focus and productivity.
"""
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role":"system","content":"You are a helpful productivity AI."},
                {"role":"user","content":prompt}
            ],
            max_tokens=100
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating AI analysis: {e}"

# -------------------------
# Streamlit App
# -------------------------
st.set_page_config(page_title="AI Focus Agent (LLM)", page_icon="🤖")
st.title("🤖 AI Focus Agent - Calendar & Tasks with LLM Analysis")

days = st.number_input("Analyze calendar for past how many days?", min_value=1, max_value=30, value=7)

if st.button("Analyze & Generate AI Suggestions"):
    with st.spinner("Fetching Calendar and Tasks..."):
        events = fetch_events(days)
        tasks = fetch_tasks(50)
        calendar_summary = summarize_calendar(events)
        tasks_summary = summarize_tasks(tasks)

    # -------------------------
    # Calendar Summary & Chart
    st.subheader("📅 Calendar Summary")
    total_minutes, daily_minutes, titles_count = calendar_summary
    st.write(f"Total time scheduled: {total_minutes/60:.2f} hours")
    st.write("Most frequent events:")
    for title, count in sorted(titles_count.items(), key=lambda x: x[1], reverse=True)[:5]:
        st.write(f"- {title}: {count} times")

    if daily_minutes:
        st.write("### Daily Time Spent (hours)")
        df = pd.DataFrame(list(daily_minutes.items()), columns=['Date', 'Minutes'])
        df['Hours'] = df['Minutes'] / 60
        df = df.sort_values('Date')
        st.bar_chart(df.set_index('Date')['Hours'])

    # -------------------------
    # Tasks Summary
    st.subheader("📝 Tasks Summary")
    total, completed, overdue = tasks_summary
    st.write(f"Total tasks: {total}, Completed: {completed}, Overdue: {overdue}")

    # -------------------------
    # AI Analysis
    st.subheader("🤖 AI Analysis & Recommendations")
    ai_text = llm_analysis(calendar_summary, tasks_summary)
    st.write(ai_text)


