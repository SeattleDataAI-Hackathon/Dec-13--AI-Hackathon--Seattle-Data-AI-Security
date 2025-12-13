import streamlit as st
import requests
import json
import time

# Page configuration
st.set_page_config(
    page_title="AI Chatbot",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS styling for better UI
st.markdown("""
<style>
    .chat-container {
        max-width: 900px;
        margin: 0 auto;
    }
    .user-message {
        background-color: #E3F2FD;
        padding: 12px 16px;
        border-radius: 12px;
        margin: 8px 0;
        text-align: right;
        border-left: 4px solid #2196F3;
    }
    .assistant-message {
        background-color: #F5F5F5;
        padding: 12px 16px;
        border-radius: 12px;
        margin: 8px 0;
        border-left: 4px solid #4CAF50;
    }
    .message-label {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 4px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Title and description
col1, col2 = st.columns([0.8, 0.2])
with col1:
    st.title("🤖 AI Assistant")
    st.markdown("*Your friendly AI chatbot - Ask me anything!*")

# Display chat history
st.markdown("---")
chat_container = st.container()

with chat_container:
    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(f"<div class='user-message'><div class='message-label'>You</div>{message['content']}</div>", unsafe_allow_html=True)
        else:
            st.markdown(f"<div class='assistant-message'><div class='message-label'>🤖 Assistant</div>{message['content']}</div>", unsafe_allow_html=True)

# Input area at the bottom
st.markdown("---")
col1, col2 = st.columns([0.85, 0.15])

with col1:
    user_input = st.text_input(
        "Type your message...",
        placeholder="Ask me anything!",
        label_visibility="collapsed",
        key="user_input"
    )

with col2:
    send_button = st.button("Send", use_container_width=True)

# Handle user input
if send_button and user_input.strip():
    # Check if API endpoint is configured
    if not st.session_state.get("api_endpoint"):
        st.error("❌ Please configure the API endpoint in the sidebar first!")
    else:
        # Add user message to history
        st.session_state.messages.append({
            "role": "user",
            "content": user_input
        })
        
        st.rerun()

# If the last message is from user, send it to the API and get response
if (st.session_state.messages and 
    st.session_state.messages[-1]["role"] == "user" and
    st.session_state.get("api_endpoint")):
    
    last_user_message = st.session_state.messages[-1]["content"]
    
    # Show loading indicator
    with st.spinner("🔄 Waiting for API response..."):
        try:
            # Send request to API
            response = requests.post(
                st.session_state.api_endpoint,
                json={"message": last_user_message},
                timeout=30
            )
            
            # Handle API response
            if response.status_code == 200:
                try:
                    data = response.json()
                    assistant_response = data.get("response", "No response from API")
                except json.JSONDecodeError:
                    assistant_response = response.text
            else:
                assistant_response = f"❌ API Error: {response.status_code} - {response.text}"
            
            # Add assistant response to history
            st.session_state.messages.append({
                "role": "assistant",
                "content": assistant_response
            })
            
            st.rerun()
            
        except requests.exceptions.ConnectionError:
            st.error(f"❌ Cannot connect to API at: {st.session_state.api_endpoint}")
        except requests.exceptions.Timeout:
            st.error("❌ API request timed out (30 seconds)")
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# Sidebar with info and API configuration
st.sidebar.markdown("### ⚙️ API Configuration")
api_endpoint = st.sidebar.text_input(
    "API Endpoint URL",
    placeholder="http://localhost:8000/chat",
    value=st.session_state.get("api_endpoint", "")
)

if api_endpoint:
    st.session_state.api_endpoint = api_endpoint
    st.sidebar.success("✓ API configured")
else:
    st.sidebar.warning("⚠️ API endpoint not configured")

st.sidebar.markdown("---")
st.sidebar.markdown("### 📌 About")
st.sidebar.info("""
This chatbot sends your messages to a backend API.

**How it works:**
1. You type a message
2. Message is sent to your API
3. Wait for API response
4. Response is displayed in chat

**API Format Expected:**
- Method: POST
- Input: `{"message": "user message"}`
- Output: `{"response": "api response"}`
""")

st.sidebar.markdown("---")
st.sidebar.markdown("### 🔧 Settings")
clear_chat = st.sidebar.button("Clear Chat History")
if clear_chat:
    st.session_state.messages = []
    st.rerun()
