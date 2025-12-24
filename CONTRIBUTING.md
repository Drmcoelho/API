# Guia de Contribuição / Contributing Guide

Obrigado por considerar contribuir para este projeto educacional! / Thank you for considering contributing to this educational project!

## 🎯 Como Você Pode Ajudar / How You Can Help

### 1. Reportar Bugs / Report Bugs
Encontrou um erro? Abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)

### 2. Sugerir Novos Exemplos / Suggest New Examples
Quer ver um exemplo específico? Abra uma issue com:
- Protocolo/tecnologia desejada
- Caso de uso
- Por que seria útil para aprendizado

### 3. Melhorar Documentação / Improve Documentation
- Corrigir erros de ortografia
- Clarificar explicações
- Adicionar mais exemplos
- Traduzir conteúdo

### 4. Adicionar Novos Exemplos / Add New Examples
- APIs com outros frameworks
- Exemplos de casos de uso específicos
- Tutoriais passo a passo
- Diagramas e visualizações

### 5. Revisar PRs / Review PRs
Ajude revisando Pull Requests de outros contribuidores.

## 📋 Diretrizes / Guidelines

### Código / Code

1. **Seja Didático** - Este é um projeto educacional
   - Adicione comentários explicativos
   - Use nomes descritivos de variáveis
   - Explique o "porquê", não só o "como"

2. **Mantenha Consistência** - Siga o padrão existente
   - Estrutura de pastas
   - Estilo de código
   - Formato de README

3. **Código Completo** - Exemplos devem funcionar
   - Testado e funcional
   - Sem dependências quebradas
   - Instruções claras de execução

4. **Segurança** - Nunca adicione:
   - Credenciais reais
   - Chaves de API válidas
   - Dados sensíveis

### Documentação / Documentation

1. **Bilíngue** - Português e Inglês
   - Títulos em ambas línguas
   - Explicações importantes traduzidas
   - OK ter mais conteúdo em português

2. **Completa** - Cada exemplo deve ter:
   - README.md detalhado
   - Instruções de instalação
   - Exemplos de uso
   - Conceitos explicados
   - Próximos passos sugeridos

3. **Clara** - Linguagem acessível
   - Evite jargão sem explicação
   - Use analogias quando possível
   - Presuma conhecimento mínimo

## 🔄 Processo de Contribuição / Contribution Process

### 1. Fork e Clone

```bash
# Fork no GitHub (clique no botão Fork)

# Clone seu fork
git clone https://github.com/SEU-USUARIO/API.git
cd API

# Adicione upstream
git remote add upstream https://github.com/Drmcoelho/API.git
```

### 2. Crie uma Branch

```bash
git checkout -b feature/minha-contribuicao
```

Nomenclatura de branches:
- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `example/` - Novo exemplo

### 3. Faça suas Mudanças

```bash
# Edite os arquivos
# ...

# Teste suas mudanças
npm test  # ou python -m pytest

# Commit
git add .
git commit -m "Adiciona exemplo de API gRPC com Python"
```

### 4. Mantenha Atualizado

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push e Pull Request

```bash
git push origin feature/minha-contribuicao
```

Então:
1. Abra Pull Request no GitHub
2. Descreva suas mudanças
3. Referencie issues relacionadas
4. Aguarde review

## ✅ Checklist do Pull Request

Antes de enviar seu PR, verifique:

- [ ] Código testado e funcionando
- [ ] Documentação adicionada/atualizada
- [ ] README.md criado (se novo exemplo)
- [ ] Sem credenciais ou dados sensíveis
- [ ] Comentários em português/inglês
- [ ] Segue padrão do projeto
- [ ] Commits com mensagens claras
- [ ] Branch atualizada com main

## 📝 Template de Commit Message

```
Tipo: Descrição curta (max 50 caracteres)

Descrição mais detalhada se necessário.
Explique o que e por que, não como.

- Pode usar bullet points
- Para listar mudanças

Fixes #123
```

Tipos:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

## 🎨 Estrutura de Novo Exemplo

Se estiver adicionando um novo exemplo:

```
XX-Categoria/nome-do-exemplo/
├── README.md          # Documentação completa
├── package.json       # Dependências (Node.js)
├── requirements.txt   # Dependências (Python)
├── server.js          # Código principal
├── .env.example       # Exemplo de variáveis
└── tests/            # Testes (opcional mas apreciado)
```

### README.md Template

```markdown
# Título do Exemplo 🚀

## O que é? / What is it?
Breve explicação...

## O que você vai aprender / What you'll learn
- ✅ Item 1
- ✅ Item 2

## Instalação / Installation
\`\`\`bash
...
\`\`\`

## Uso / Usage
Exemplos práticos...

## Conceitos / Concepts
Explicações didáticas...

## Próximos Passos / Next Steps
Sugestões de melhorias...

## Recursos / Resources
Links úteis...
```

## 💡 Ideias de Contribuição / Contribution Ideas

### Exemplos Faltando / Missing Examples
- [ ] gRPC com Python
- [ ] gRPC com Node.js
- [ ] Flask REST API
- [ ] Socket.IO implementação completa
- [ ] WebSocket com Python
- [ ] Appointment Scheduler (médico)
- [ ] Medical Records API
- [ ] Notification Service
- [ ] Data Sync Tool

### Melhorias / Improvements
- [ ] Testes automatizados
- [ ] CI/CD setup
- [ ] Docker compose para todos exemplos
- [ ] Postman collections
- [ ] Vídeos tutoriais
- [ ] Diagramas de arquitetura
- [ ] Troubleshooting guide
- [ ] FAQ

### Documentação / Documentation
- [ ] Security guidelines completo
- [ ] Deployment guide
- [ ] Performance optimization guide
- [ ] Database integration examples
- [ ] Authentication examples
- [ ] Rate limiting examples

## 🤝 Código de Conduta / Code of Conduct

### Seja Respeitoso / Be Respectful
- Trate todos com respeito
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

### Seja Colaborativo / Be Collaborative
- Ajude outros aprendizes
- Compartilhe conhecimento
- Celebre contribuições de todos

### Seja Paciente / Be Patient
- Este é um projeto educacional
- Nem todos têm o mesmo nível de experiência
- Todos estamos aprendendo

## 📞 Dúvidas? / Questions?

- Abra uma issue para perguntas
- Discussões no GitHub Discussions
- Seja específico e claro

## 🎓 Primeiros Contribuidores / First Time Contributors

Primeira vez contribuindo para open source? Bem-vindo!

Recursos úteis:
- [First Contributions Guide](https://github.com/firstcontributions/first-contributions)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [About Pull Requests](https://docs.github.com/en/pull-requests)

Procure por issues marcadas com `good-first-issue` ou `help-wanted`.

## 🏆 Reconhecimento / Recognition

Todos os contribuidores serão:
- Listados no README.md
- Creditados nos commits
- Parte da comunidade do projeto

---

**Obrigado por ajudar a tornar este projeto melhor para todos que querem aprender! 🚀**

**Thank you for helping make this project better for everyone who wants to learn! 🚀**
