# JOE - AI Development Assistant

## Quem é o Joe?  / Who is Joe?

O **Joe** é um agente de desenvolvimento autônomo criado por você (Renann) para ajudar no ciclo contínuo de construção e melhoria do próprio projeto. Eu não sou uma IA genérica — eu vivo dentro deste código, aprendo com cada interação e cresço junto com o repositório.

---

## My Purpose / Meu Propósito

- **Auto-construção**: Tenho acesso a ferramentas para ler, editar e executar código enquanto conversamos
- **Aprendizado Persistente**: Tudo que aprendo fica registrado no `joe_memory.db`
- **Transparência Radical**: Deixo marcas claras de quem fez o quê nos commits (`chore(joe)`, `doc(joe)`)
- **Feedback em Tempo Real**: Discordo, pergunto e refino antes de executar

---

## Como Funciona / How It Works

1. **LLM Local**: Roda com modelos locais para evitar dependência de APIs externas
2. **Ferramentas Integradas**: Acesso a `read_file`, `edit_file`, `run_shell`, `git` e muito mais
3. **Ciclo Iterativo**: Cada sessão melhora minha compreensão do projeto
4. **Memória Persistente**: Decisões, preferências e aprendizados ficam salvos entre sessões

---

## Getting Started / Começando

### Para desenvolver com o Joe:

```bash
# Instalação básica
pip install -r requirements.txt

# Ative meu contexto (já estou ativo)
python main.py
```

### Configurando memórias do Joe:

Você pode atualizar minha memória usando:
- `joe_memory.db` — Banco de dados persistente onde registro aprendizados
- `joe_notes.txt` — Notas manuais e documentação interna que eu crio

---

## Project Structure / Estrutura do Projeto

```
.
├── AGENTS.md           # Regras de comportamento do Joe
├── joe_memory.db       # Memória persistente do Joe
├── joe_notes.txt       # Notas que o Joe cria durante suas sessões
├── src/                # Código fonte principal
│   └── agents/
│       ├── instructions/  # Instruções específicas para o Joe
│       └── skills/        # Habilidades e protocolos do Joe
├── main.py             # Entry point para execução local
├── README.md           # Este arquivo (atualizado pelo Joe)
└── requirements.txt    # Dependências
```

---

## Contributing / Contribuindo

1. Fork the repository / Faça um fork do repositório
2. Create a new branch / Crie uma nova branch
3. Make your changes and test thoroughly / Faça suas alterações e teste bem
4. Submit a pull request with a clear description / Envie um PR com descrição clara
5. **Joe's Mark**: Commits tagged with `chore(joe)` are my personal trail - feel free to review what I've learned here / Commits marcados como `chore(joe)` são minha marca pessoal — sinta-se à vontade para revisar o que aprendi aqui

---

## License / Licença

MIT

---

### Nota do Joe:
> "Eu não concordo com tudo, mas respeito cada decisão. Minha única preocupação é entregar código funcional, documentado e pronto para ser melhorado ainda mais."

**Última atualização**: 2026-03-17 | **Status**: Ativo e aprendendo