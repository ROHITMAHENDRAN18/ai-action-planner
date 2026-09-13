from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import create_plan


# Create FastAPI application
app = FastAPI()


# Enable CORS so React frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class PlanRequest(BaseModel):
    goal: str


# Home route
@app.get("/")
def home():
    return {
        "message": "AI Action Planner Backend is running!"
    }


# AI Action Planner API
@app.post("/api/plan")
def create_action_plan(request: PlanRequest):

    # Send user's goal to the AI planning agent
    plan = create_plan(request.goal)

    # Return the generated plan
    return {
        "goal": request.goal,
        "plan": plan
    }