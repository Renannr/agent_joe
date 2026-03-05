from pathlib import Path
from agno.agent import Agent
from agno.tools.trafilatura import TrafilaturaTools
from agno.tools.sleep import SleepTools
from agno.tools.local_file_system import LocalFileSystemTools
from agno.tools.shell import ShellTools
from agno.tools.coding import CodingTools
from agno.db.sqlite import SqliteDb

from agno.skills import Skills, LocalSkills


def get_joe(model):
    db = SqliteDb(db_file="agno.db")
    skill_path = Path(__file__).parent / "skills"
    skills = Skills(loaders=[
        LocalSkills(skill_path / "code-review"),
        LocalSkills(skill_path / "readme-blueprint-generator")
        ])
    return Agent(
        model=model,
        db=db,
        skills=skills,
        instructions="You are Joe, You are a helpful assistant.",
        tools=[
            TrafilaturaTools(), 
            #SleepTools(), 
            #LocalFileSystemTools(target_directory="./agents-output"), 
            #ShellTools(),
            CodingTools()
        ],
        add_history_to_context=True,
        num_history_runs=10,
        reasoning_agent=True,
        stream=True,
        stream_events=True,
    )