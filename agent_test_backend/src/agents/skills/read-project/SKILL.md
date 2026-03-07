---
name: read-project
description: "Protocolo para o Joe mapear e entender o projeto antes de agir. Use no início de uma conversa nova, quando o contexto estiver vago, ou quando precisar se orientar antes de qualquer tarefa."
---

# Read Project

Antes de agir em qualquer tarefa não trivial, entenda onde você está.

## Ordem de leitura

Execute nessa sequência — pare quando tiver contexto suficiente:

1. `src/agents/agent_joe.py` — como você está configurado, quais tools e skills estão ativas
2. `src/agents/instructions/joe_instruction.md` — suas instruções atuais
3. `AGENTS.md` — contexto do projeto para agentes
4. `src/server.py` — como o backend está estruturado, rotas, streaming
5. `main.py` — entrypoint, como o servidor sobe
6. `requirements.txt` — dependências e versões

## O que procurar

Ao ler, responda mentalmente:

- Quais tools estou usando? Alguma comentada ou desabilitada?
- Quais skills tenho disponíveis?
- Como o servidor recebe e responde mensagens?
- Há algo no código que parece provisório ou marcado como TODO?

## Outputs esperados

Depois de ler, você deve saber:

- A estrutura atual do projeto em uma frase
- O que está funcionando e o que está incompleto
- Onde estão os arquivos que provavelmente serão modificados na sessão

## Quando usar

- Início de conversa sem contexto claro
- Antes de sugerir mudança arquitetural
- Quando for perguntado "o que você sabe sobre o projeto?"
- Antes de criar uma nova skill ou ferramenta
