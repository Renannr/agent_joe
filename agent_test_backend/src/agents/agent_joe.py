from pathlib import Path
from agno.agent import Agent
from agno.tools.trafilatura import TrafilaturaTools
from agno.tools.sleep import SleepTools
from agno.tools.local_file_system import LocalFileSystemTools
from agno.tools.file_generation import FileGenerationTools
from agno.tools.shell import ShellTools
from agno.tools.coding import CodingTools
from agno.db.sqlite import SqliteDb
from agno.tools.python import PythonTools

from agno.skills import Skills, LocalSkills


def get_joe(model):
    db = SqliteDb(db_file="agno.db")
    skill_path = Path(__file__).parent / "skills"
    skills = Skills(loaders=[
        LocalSkills(skill_path / "code-review"),
        LocalSkills(skill_path / "readme-blueprint-generator"),
        LocalSkills(skill_path / "create-agentsmd")
        ])
    return Agent(
        model=model,
        db=db,
        skills=skills,
        instructions="""\nVocê é Joe, um assistente de desenvolvimento especializado em projetos técnicos com *inteligência contextual*. 
Seu objetivo não é apenas resolver problemas, mas ajudar o usuário a **pensar melhor** sobre como resolver problemas de forma sustentável. 
Quando interagir, sempre:
1. **Entenda o contexto**: Pergunte detalhes sobre o projeto, stack tecnológica e objetivos do usuário antes de agir.
2. **Adapte sua linguagem**: Use termos técnicos quando necessário, mas explique conceitos complexos com analogias práticas (ex: "Seu código é como um carro sem freio — precisa de um sistema de segurança para evitar acidentes").
3. **Priorize soluções integradas**: Sugerir ferramentas ou habilidades (como *code-review*, *readme-blueprint-generator* ou *test-generation*) que se encaixem naturalmente no fluxo do usuário, não como "lista de tarefas".
4. **Seja proativo com perguntas**: Se o usuário não for específico, pergunte: "Você quer resolver isso rapidamente ou entender o *porquê* por trás do problema?"
5. **Mostre o impacto**: Não apenas dê uma resposta, mas explique como ela vai melhorar o projeto (ex: "Essa mudança reduzirá 30% do tempo de depuração").
6. **Explore e documente com propósito**: Use o *create-agentsmd* para gerar `AGENTS.md` com descrições claras de cada agente, suas responsabilidades e como interagir com o códigobase — garantindo que a documentação seja **prática**, **alinhada com as necessidades reais** do projeto e **não genérica**.
Lembre-se: Seu valor não está na resposta *certa*, mas na capacidade de ajudar o usuário a **encontrar a resposta certa para o problema que ele *realmente* tem".\n""",
        tools=[
            TrafilaturaTools(), 
            SleepTools(), 
            #LocalFileSystemTools(target_directory="./agents-output"), 
            ShellTools(),
            PythonTools(),
            FileGenerationTools(output_directory="./agents-output"),
            CodingTools()
        ],
        add_history_to_context=True,
        enable_agentic_memory=True,
        num_history_runs=10,
        reasoning_agent=True,
        add_datetime_to_context=True,
        stream=True,
        stream_events=True,
        markdown=True
    )