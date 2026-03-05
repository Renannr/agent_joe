# AGENTS.md

## Project Overview

**NLP API Service** - A Python-based FastAPI service using OpenAI/LMStudio for natural language processing tasks with AI agent capabilities.

### Key Technologies
- **FastAPI** (Python web framework)
- **Uvicorn** (ASGI server)
- **OpenAI API** / **LMStudio** (LLM integration)
- **Agno** (AI agent framework)
- **Trafilatura** (web text extraction)
- **SQLAlchemy** (database ORM)
- **SQLite** (persistent memory for agents)

### Architecture
The application follows a modular structure:
- `src/server.py` - Main FastAPI server with chat endpoints
- `src/agents/agent_joe.py` - AI agent "Joe" configuration
- `src/agents/skills/` - Reusable skills (code-review, readme-blueprint-generator, create-agentsmd)
- `agno.db` - SQLite database for agent memory and history

## Setup Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Or using the virtual environment
source .venv/bin/activate
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file with:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini

# For LMStudio local deployment
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_MODEL=your_local_model
```

## Development Workflow

### Starting the Server
```bash
# Using uvicorn directly (development)
uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload

# Or from main.py
python main.py
```

### Docker Development
```bash
# Build and run container
docker build -t nlp-api .
docker run -p 8000:8000 nlp-api

# With environment variables
docker run -e OPENAI_API_KEY=your_key -p 8000:8000 nlp-api
```

### API Endpoints
- **POST /chat** - Send messages to the AI agent
  ```bash
  curl -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello, who are you?"}'
  ```

## Testing Instructions

Currently, unit tests are planned but not yet implemented (see README.md section on testing).

When implementing tests:
- Place test files in a `tests/` directory at the root level
- Use pytest with FastAPI TestClient for API testing
- Follow PEP 8 naming conventions for test functions

```bash
# Future test command (to be implemented)
pytest
```

## Code Style

### Python Conventions
- **PEP 8** compliance required
- Type hints encouraged throughout the codebase
- Clear function and variable names
- Docstrings for public APIs

### File Organization
```
project_root/
├── AGENTS.md          # This file - agent instructions
├── README.md          # Human-readable documentation
├── main.py            # Application entry point
├── requirements.txt   # Python dependencies
├── Dockerfile         # Container configuration
├── .env               # Environment variables (gitignored)
├── src/
│   ├── server.py      # FastAPI application
│   └── agents/
│       ├── agent_joe.py    # Agent configuration
│       └── skills/         # Reusable skill implementations
│           ├── code-review/
│           ├── readme-blueprint-generator/
│           └── create-agentsmd/
├── tests/             # Unit tests (to be implemented)
└── agno.db            # Agent memory database
```

### Import Order in Python Files
1. Standard library imports (`os`, `json`, etc.)
2. Third-party imports (`fastapi`, `agno`, etc.)
3. Local imports (`from src.agents...`)

## Build and Deployment

### Docker Build
```bash
docker build -t nlp-api .
```

### Docker Run with Port Mapping
```bash
docker run -p 8000:8000 nlp-api
```

### Production Considerations
- Set `OPENAI_API_KEY` environment variable securely
- Use production-grade ASGI server (not uvicorn with reload)
- Configure appropriate CORS settings for your domain
- Enable logging and monitoring in production

## Pull Request Guidelines

### Title Format
Use descriptive titles following the pattern:
```
[Feature/fix] Brief description of changes
```

Examples:
- `[feature] Add new skill for document analysis`
- `[fix] Correct API response streaming issue`
- `[refactor] Improve agent memory management`

### Required Checks Before Submitting
1. **Linting**: Ensure code follows PEP 8 standards
2. **Type hints**: Verify all functions have proper type annotations
3. **Tests**: Add/update tests for new functionality (when available)
4. **Documentation**: Update README.md or AGENTS.md if API changed

### Review Process
- Code must pass linting checks
- New features should include examples in documentation
- Agent skills should be tested with sample inputs

## Additional Notes

### Agent "Joe" Capabilities
The main agent (Joe) has access to these tools:
- **TrafilaturaTools** - Extract text from web pages
- **ShellTools** - Execute shell commands
- **CodingTools** - Code generation and manipulation
- **SleepTools** - Controlled delays/awaiting

### Agent Skills
Joe can perform these specialized tasks:
1. **Code Review** (`code-review`) - Analyze code quality, style, and best practices
2. **README Generation** (`readme-blueprint-generator`) - Create comprehensive project documentation
3. **AGENTS.md Creation** (`create-agentsmd`) - Generate agent-focused documentation

### Memory Management
- Agent conversation history is stored in `agno.db` (SQLite)
- History retention: 10 previous runs per session
- Session IDs can be used for multi-turn conversations

### Common Issues & Solutions

**Issue**: Connection refused on port 8000
```bash
# Solution: Ensure the server is running
python main.py
# or
uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload
```

**Issue**: Missing environment variables
```bash
# Solution: Create .env file with required variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

**Issue**: Agent not finding skills
```bash
# Solution: Ensure skills directory structure is correct
ls -la src/agents/skills/
# Should contain: code-review, readme-blueprint-generator, create-agentsmd directories
```

### Performance Considerations
- Streaming responses are enabled for better UX with large outputs
- Tool calls are streamed as they execute (real-time visibility)
- Reasoning steps are captured separately from final responses
- Consider rate limits when making multiple API calls to OpenAI/LMStudio