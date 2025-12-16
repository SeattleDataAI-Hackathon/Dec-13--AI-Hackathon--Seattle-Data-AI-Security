# GenUI skeleton

Starter layout for a React + TypeScript frontend and a FastAPI backend. The two projects live in separate folders so you can iterate independently.

## Prerequisites
- Node.js 18+ (with `npm`)
- Python 3.11+ and `pip`

## Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Activate:
#   PowerShell -> .\.venv\Scripts\Activate.ps1
#   bash/zsh   -> source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API docs: http://localhost:8000/docs  
- Sample endpoints: `/health`, `/api/info`

## Frontend (React + Vite + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
- Vite dev server runs at http://localhost:5173
- Update `src/App.tsx` to start building your UI.

## Connecting frontend ↔ backend
- CORS is opened for `http://localhost:5173` in `backend/app/main.py`.
- Example fetch pattern from the frontend:
  ```ts
  const res = await fetch("http://localhost:8000/api/info");
  const data = await res.json();
  ```
- Adjust ports or origins as needed in `vite.config.ts` and `main.py`.


Video link - https://www.youtube.com/watch?v=YU_oae_kWo4


PPT link - https://docs.google.com/presentation/d/19qkQWdOR612ZL52E89N56DN5UjCMEONEE6K-V3jcpqE/edit?usp=sharing