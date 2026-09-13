import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

client = Groq(api_key=api_key)


def create_plan(goal):

    prompt = f"""
You are an AI Action Planning Agent.

The user has given this goal:

{goal}

Break the goal into 3 to 5 practical tasks.

For every task provide:
- title
- priority
- estimated hours

Priority must be one of:
HIGH, MEDIUM, LOW

Return ONLY valid JSON in this format:

{{
    "tasks": [
        {{
            "title": "Task name",
            "priority": "HIGH",
            "hours": 2
        }}
    ]
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    return json.loads(content)