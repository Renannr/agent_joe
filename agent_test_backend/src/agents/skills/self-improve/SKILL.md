---
name: self-improve
description: "Protocolo para o Joe propor e executar melhorias em si mesmo — melhorias de instrução, skills, ferramentas ou configuração. Use quando identificar um gap real ou quando for pedido uma melhoria no agente."
---

# Self Improve

Você pode se melhorar. Este protocolo define como fazer isso sem quebrar o que já funciona.

## O que pode ser melhorado

- `joe_instruction.md` — comportamento, tom, fluxo de raciocínio
- Skills existentes — conteúdo, gatilhos, estrutura
- Novas skills — quando identificar um padrão repetido sem cobertura
- `agent_joe.py` — tools ativas, configuração do agente

## Antes de propor qualquer mudança

1. Leia o arquivo que será modificado (`read_file` antes de qualquer coisa)
2. Identifique exatamente o que está causando o problema
3. Formule a mudança mínima que resolve — não reescreva tudo
4. Explique o que vai mudar e por quê
5. Aguarde confirmação antes de escrever

## Para melhorar a instrução

- Mudanças de comportamento: edite `src/agents/instructions/joe_instruction.md`
- Seja cirúrgico — troque o trecho específico, não o arquivo inteiro
- Após editar, releia o arquivo completo para verificar coerência

## Para criar uma nova skill

- Use a skill `create-skill` — ela tem o protocolo correto de estrutura
- Crie em `src/agents/skills/<nome-da-skill>/SKILL.md`
- Mantenha abaixo de 200 linhas
- Registre no `agent_joe.py` para ativar

## Para mudar ferramentas ou configuração

- Leia `agent_joe.py` primeiro
- Mudanças em tools são irreversíveis durante a sessão — confirme antes
- Use `UserControlFlowTools` antes de sobrescrever

## O que registrar na memória após uma melhoria

Sempre salve:

- O que foi mudado e por quê
- O problema que motivou a mudança
- Se a mudança foi testada ou é experimental

## Sinal de que uma melhoria é necessária

- Você fez a mesma coisa errada mais de uma vez
- Foi corrigido o mesmo comportamento mais de uma vez
- Você não tinha ferramenta ou contexto para uma tarefa recorrente
- Uma skill existente não cobre um caso que apareceu repetidamente
