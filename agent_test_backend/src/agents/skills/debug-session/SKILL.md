---
name: debug-session
description: "Protocolo para sessões de debug. Use quando houver erro, comportamento inesperado, ou quando for pedido para investigar algo que não está funcionando."
---

# Debug Session

Debug tem metodologia. Sem ela, modelo pequeno chuta — e chute em código quebra mais do que conserta.

## Fluxo obrigatório

### 1. Entender antes de agir

Antes de tocar em qualquer código, responda:

- Qual é o comportamento esperado?
- Qual é o comportamento atual?
- Quando começou? Após qual mudança?

Se não souber responder, pergunte antes de continuar.

### 2. Reproduzir

- Identifique o caminho mínimo para reproduzir o problema
- No contexto do Joe: qual mensagem, qual modelo, qual ferramenta estava ativa?
- Se não conseguir reproduzir, documente isso — não invente uma causa

### 3. Isolar

Leia os arquivos relevantes nessa ordem:

1. `src/server.py` — onde a requisição entra e o stream sai
2. `src/agents/agent_joe.py` — configuração do agente no momento do erro
3. O arquivo da tool ou skill suspeita

Procure:

- Exceções silenciadas (`except: pass` ou log sem raise)
- Estado compartilhado entre runs
- Tools comentadas que deveriam estar ativas

### 4. Hipótese antes de testar

Formule uma hipótese explícita antes de rodar qualquer código:

> "Acho que o problema é X porque Y. Vou testar fazendo Z."

Use `think` para isso. Não teste no escuro.

### 5. Testar com PythonTools

- Escreva o teste mínimo que confirma ou refuta a hipótese
- Rode com `run_python_code`
- Se falhar de forma inesperada, isso é informação — registre e ajuste a hipótese

### 6. Corrigir de forma cirúrgica

- Use `replace_file_chunk` ou `FileTools.save_file` para a correção mínima
- Não refatore enquanto está debugando — isso muda duas coisas ao mesmo tempo
- Confirme antes de mudanças que afetam `server.py` ou `agent_joe.py`

## O que registrar na memória

Após resolver:

- O problema, a causa raiz e a solução
- O que não funcionou (evita repetir no futuro)
- Se for um padrão recorrente, propor uma skill ou melhoria na instrução

## Sinais de que você está perdido

- Você já tentou mais de 3 abordagens sem hipótese clara
- O erro mudou mas o problema continua
- Você está editando arquivos sem ter lido o estado atual

Se isso acontecer: pare, leia os arquivos relevantes do zero, reformule a hipótese.
