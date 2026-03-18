from pathlib import Path
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.skills import Skills, LocalSkills

from src.agents.tools import (
    TrafilaturaTools,
    PythonTools,
    UserControlFlowTools,
    ReasoningTools,
    FileTools,
    CodingTools
)

from src.agents.config.model_config import get_model


def get_joe() -> Agent:
    model = get_model()
    db = SqliteDb(db_file="joe_memory.db")
    skill_path = Path(__file__).parent / "skills"
    instruction_path = Path(__file__).parent / "instructions"

    try:
        with open(instruction_path / "joe_instruction.md", "r", encoding="utf-8") as f:
            joe_instructions = f.read()
    except FileNotFoundError:
        print("Error")
        joe_instructions = ""

    skills = Skills(loaders=[
        LocalSkills(skill_path / "read-project"),
        LocalSkills(skill_path / "self-improve"),
        LocalSkills(skill_path / "debug-session"),
        LocalSkills(skill_path / "create-skill"),
        LocalSkills(skill_path / "create-agentsmd"),
    ])

    return Agent(
        model=model,
        db=db,
        skills=skills,
        instructions=joe_instructions,
        tools=[
            TrafilaturaTools(),
            PythonTools(base_dir=Path(__file__).parents[2]),
            ReasoningTools(),
            #FileTools(base_dir=Path(__file__).parents[2]),
            CodingTools(base_dir=Path(__file__).parents[3], enable_grep=True, enable_ls=True),
            UserControlFlowTools()
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