import os
import json

from dotenv import load_dotenv
from groq import Groq
from tools import calculate_time_budget


# Load environment variables
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

client = Groq(api_key=api_key)


def create_plan(goal):

    # --------------------------------------------------
    # STEP 1: Generate initial plan
    # --------------------------------------------------

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

Create a practical and realistic plan.

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

    # Convert AI response into Python dictionary
    plan = json.loads(content)

    # --------------------------------------------------
    # STEP 2: Use Time Budget Tool
    # --------------------------------------------------

    time_budget = calculate_time_budget(plan["tasks"])

    # --------------------------------------------------
    # STEP 3: Agent evaluates the plan
    # --------------------------------------------------

    if time_budget["status"] == "HEAVY":

        revision_prompt = f"""
You are an AI Action Planning Agent.

The user wants to achieve this goal:

{goal}

You generated the following plan:

{json.dumps(plan["tasks"], indent=2)}

The Time Budget Tool calculated:

Total hours: {time_budget["total_hours"]}
Status: HEAVY

The plan is too heavy.

You must autonomously revise the plan to make it more realistic.

Requirements:
- Keep 3 to 5 practical tasks.
- Prioritize the most important activities.
- Remove unnecessary activities.
- Reduce excessive study/work hours.
- Keep HIGH, MEDIUM, LOW priorities.
- Make the final plan practical for the user's goal.

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

        # --------------------------------------------------
        # STEP 4: Ask AI to revise the plan
        # --------------------------------------------------

        revision_response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": revision_prompt
                }
            ],
            temperature=0.2
        )

        revised_content = revision_response.choices[0].message.content

        # Convert revised AI response into dictionary
        plan = json.loads(revised_content)

        # --------------------------------------------------
        # STEP 5: Use the tool again
        # --------------------------------------------------

        time_budget = calculate_time_budget(plan["tasks"])

    # --------------------------------------------------
    # STEP 6: Add final time budget to the plan
    # --------------------------------------------------

    plan["time_budget"] = time_budget

    # --------------------------------------------------
    # STEP 7: Return final plan
    # --------------------------------------------------

    return plan