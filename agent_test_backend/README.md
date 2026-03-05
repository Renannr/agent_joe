# NLP API Service

A Python-based NLP service using FastAPI, OpenAI, and Trafilatura for text processing.

## Technology Stack
- **FastAPI** (Python)
- **Uvicorn** (ASGI server)
- **Python 3.12**
- **OpenAI API**
- **Trafilatura** (text extraction)
- **Agno** (LLM integration)
- **SQLAlchemy** (database ORM)

## Architecture
The application follows a modular structure with the main server located in `src/server.py`. It uses Docker for containerization and deployment. The entry point for development is `main.py` which runs uvicorn.

## Getting Started

### Development Setup
1. Clone the repository
2. Create a virtual environment: `python -m venv .venv && source .venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and configure your API keys
5. Run the server: `python main.py`

### Docker Setup
1. Clone the repository
2. Build the Docker image: `docker build -t nlp-api .`
3. Run the container: `docker run -p 8000:8000 --env-file .env nlp-api`

## Project Structure
- `src/`: Contains the application code
  - `server.py`: Main FastAPI server
  - `agents/`: Agent implementations
- `main.py`: Entry point for running uvicorn in development mode
- `Dockerfile`: Docker configuration
- `requirements.txt`: Project dependencies
- `.env`: Environment variables (contains API keys)

## Key Features
- Text extraction using Trafilatura
- Integration with OpenAI API for NLP tasks
- RESTful API endpoints for processing text
- Modular agent architecture

## Development Workflow
- Use Docker for consistent production environment
- Run with `uvicorn` or `python main.py` for development
- Follow PEP 8 coding standards

## Coding Standards
- Follow PEP 8
- Use type hints
- Keep functions and classes focused on single responsibilities

## Testing
Unit tests are included in the `tests/` directory (to be implemented).

## Contributing
1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description of changes

## License
MIT