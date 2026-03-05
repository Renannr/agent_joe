from pathlib import Path
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.skills import Skills, LocalSkills

from src.agents.tools import (
    TrafilaturaTools,
    SleepTools,
    ShellTools,
    PythonTools,
    FileGenerationTools,
    CodingTools
)


def get_joe(model):
    db = SqliteDb(db_file="agno.db")
    skill_path = Path(__file__).parent / "skills"
    instruction_path = Path(__file__).parent / "instructions"

    try:
        with open(instruction_path / "joe_instruction.md", "r", encoding="utf-8") as f:
            joe_instructions = f.read()
    except FileNotFoundError:
        print("Error")
        joe_instructions = ""

    skills = Skills(loaders=[
        LocalSkills(skill_path / "readme-blueprint-generator"),
        LocalSkills(skill_path / "create-skill"),
        LocalSkills(skill_path / "create-agentsmd")
        ])
    
    return Agent(
        model=model,
        db=db,
        skills=skills,
        instructions=joe_instructions,
        tools=[
            TrafilaturaTools(), 
            SleepTools(), 
            ShellTools(),
            PythonTools(),
            FileGenerationTools(output_directory="./agents-output"),
            CodingTools()
        ],
        add_history_to_context=True,
        enable_agentic_memory=True,
        num_history_runs=5,
        reasoning_agent=True,
        add_datetime_to_context=True,
        stream=True,
        stream_events=True,
        markdown=True
    )