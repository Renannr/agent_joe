# NLP API Service

A Python-based NLP service using FastAPI, OpenAI, and Trafilatura for text processing.

## Technology Stack
- **FastAPI** (Python)
- **Uvicorn** (ASGI server)
- **Python 3.12**
- **OpenAI API**
- **Trafilatura** (text extraction)

## Architecture
The application follows a modular structure with the main server located in `src/server.py`. It uses Docker for containerization and deployment.

## Getting Started
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the Docker container: `docker build -t nlp-api . && docker run -p 8000:8000 nlp-api`

## Project Structure
- `src/`: Contains the application code
- `Dockerfile`: Docker configuration
- `requirements.txt`: Project dependencies
- `main.py`: Entry point for the application

## Key Features
- Text extraction using Trafilatura
- Integration with OpenAI API for NLP tasks
- RESTful API endpoints for processing text

## Development Workflow
- Use Docker for consistent environment
- Run with `uvicorn` for development

## Coding Standards
- Follow PEP 8
- Use type hints

## Testing
Unit tests are included in the `tests/` directory (to be implemented).

## Contributing
1. Fork the repository
2. Create a new branch
3. Submit a pull request

## License
MIT