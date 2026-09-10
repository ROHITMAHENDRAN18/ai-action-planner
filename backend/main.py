from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class PlanRequest(BaseModel):
    goal: str


@app.get("/")
def home():
    return {
        "message": "AI Action Planner Backend is running!"
    }


@app.post("/api/plan")
def create_plan(request: PlanRequest):

    return {
        "goal": request.goal,
        "tasks": [
            {
                "title": "Understand the topic",
                "priority": "HIGH",
                "hours": 2
            },
            {
                "title": "Practice important questions",
                "priority": "HIGH",
                "hours": 2
            },
            {
                "title": "Review what you learned",
                "priority": "MEDIUM",
                "hours": 1
            }
        ]
    }