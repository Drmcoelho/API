# API de Agendador de Tarefas ⏰

## Visão Geral / Overview

API REST para agendamento e automação de tarefas. Perfeito para aprender sobre sistemas de automação, cron jobs, e gerenciamento de tarefas assíncronas.

## Casos de Uso / Use Cases

✅ **Backup Automático** - Agendar backups diários
✅ **Relatórios** - Gerar relatórios semanais/mensais
✅ **Notificações** - Enviar lembretes em horários específicos
✅ **Limpeza de Dados** - Remover dados antigos periodicamente
✅ **Sincronização** - Sincronizar dados entre sistemas
✅ **Monitoramento** - Verificar status de serviços
✅ **Envio de Emails** - Newsletters, campanhas

## Características / Features

✅ Agendamento com sintaxe cron
✅ Tarefas recorrentes e únicas
✅ Histórico de execuções
✅ Logs detalhados
✅ Retry automático em caso de falha
✅ Pausar/retomar tarefas
✅ Notificações de sucesso/falha

## Instalação / Installation

```bash
cd 06-Automation/task-scheduler

npm install
npm start
```

## Endpoints da API / API Endpoints

### Tarefas / Tasks

```bash
# Listar todas as tarefas
GET /api/tasks

# Buscar tarefa específica
GET /api/tasks/:id

# Criar nova tarefa
POST /api/tasks

# Atualizar tarefa
PUT /api/tasks/:id

# Deletar tarefa
DELETE /api/tasks/:id

# Executar tarefa manualmente
POST /api/tasks/:id/execute

# Pausar tarefa
POST /api/tasks/:id/pause

# Retomar tarefa
POST /api/tasks/:id/resume
```

### Execuções / Executions

```bash
# Histórico de execuções
GET /api/tasks/:id/executions

# Logs de execução específica
GET /api/executions/:id/logs
```

## Sintaxe Cron / Cron Syntax

```
┌────────────── minuto (0 - 59)
│ ┌──────────── hora (0 - 23)
│ │ ┌────────── dia do mês (1 - 31)
│ │ │ ┌──────── mês (1 - 12)
│ │ │ │ ┌────── dia da semana (0 - 6) (domingo = 0)
│ │ │ │ │
* * * * *
```

### Exemplos de Padrões Cron

```bash
# A cada minuto
"* * * * *"

# Todos os dias às 9:00
"0 9 * * *"

# Toda segunda-feira às 10:30
"30 10 * * 1"

# Primeiro dia de cada mês às 00:00
"0 0 1 * *"

# A cada 15 minutos
"*/15 * * * *"

# De segunda a sexta às 18:00
"0 18 * * 1-5"

# Aos domingos às 23:00
"0 23 * * 0"
```

## Exemplos de Uso / Usage Examples

### 1. Criar Tarefa de Backup Diário

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backup Diário do Banco de Dados",
    "description": "Backup automático dos dados",
    "schedule": "0 2 * * *",
    "type": "backup",
    "action": {
      "command": "backup-database",
      "params": {
        "database": "production",
        "destination": "/backups"
      }
    },
    "retry": {
      "enabled": true,
      "maxAttempts": 3,
      "delay": 300
    },
    "notifications": {
      "onSuccess": ["admin@company.com"],
      "onFailure": ["admin@company.com", "dev@company.com"]
    }
  }'
```

### 2. Criar Tarefa de Relatório Semanal

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Relatório Semanal de Vendas",
    "schedule": "0 9 * * 1",
    "type": "report",
    "action": {
      "command": "generate-report",
      "params": {
        "type": "sales",
        "period": "weekly",
        "recipients": ["manager@company.com"]
      }
    }
  }'
```

### 3. Criar Tarefa de Limpeza

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limpar Logs Antigos",
    "description": "Remove logs com mais de 30 dias",
    "schedule": "0 3 1 * *",
    "type": "cleanup",
    "action": {
      "command": "clean-logs",
      "params": {
        "olderThan": 30,
        "directory": "/var/logs"
      }
    }
  }'
```

### 4. Executar Tarefa Manualmente

```bash
curl -X POST http://localhost:3000/api/tasks/123/execute
```

### 5. Pausar Tarefa

```bash
curl -X POST http://localhost:3000/api/tasks/123/pause
```

## Tipos de Tarefas / Task Types

### 1. Backup
```javascript
{
  type: "backup",
  action: {
    command: "backup-database",
    params: {
      database: "production",
      destination: "/backups",
      compression: true
    }
  }
}
```

### 2. Report
```javascript
{
  type: "report",
  action: {
    command: "generate-report",
    params: {
      type: "sales|users|performance",
      period: "daily|weekly|monthly",
      format: "pdf|excel|csv"
    }
  }
}
```

### 3. Notification
```javascript
{
  type: "notification",
  action: {
    command: "send-notification",
    params: {
      recipients: ["user@email.com"],
      message: "Seu relatório está pronto",
      channel: "email|sms|push"
    }
  }
}
```

### 4. Cleanup
```javascript
{
  type: "cleanup",
  action: {
    command: "clean-data",
    params: {
      target: "logs|temp|cache",
      olderThan: 30
    }
  }
}
```

### 5. Sync
```javascript
{
  type: "sync",
  action: {
    command: "sync-data",
    params: {
      source: "system-a",
      destination: "system-b",
      fields: ["users", "products"]
    }
  }
}
```

### 6. Custom Script
```javascript
{
  type: "script",
  action: {
    command: "execute-script",
    params: {
      script: "/scripts/custom-task.sh",
      args: ["--verbose", "--force"]
    }
  }
}
```

## Modelo de Dados / Data Model

```javascript
{
  id: "uuid",
  name: "Nome da Tarefa",
  description: "Descrição detalhada",
  schedule: "0 9 * * *",  // Cron expression
  type: "backup|report|notification|cleanup|sync|script",
  action: {
    command: "comando-a-executar",
    params: { /* parâmetros */ }
  },
  status: "active|paused|completed|failed",
  retry: {
    enabled: true,
    maxAttempts: 3,
    delay: 300  // segundos
  },
  notifications: {
    onSuccess: ["email@exemplo.com"],
    onFailure: ["email@exemplo.com"]
  },
  lastExecution: {
    timestamp: "2024-01-15T10:00:00Z",
    status: "success|failed",
    duration: 1234,  // ms
    logs: "Logs da execução..."
  },
  nextExecution: "2024-01-16T10:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

## Recursos Avançados / Advanced Features

### 1. Dependências entre Tarefas
Execute tarefas em sequência:
```javascript
{
  dependencies: ["task-id-1", "task-id-2"],
  runAfter: "all"  // ou "any"
}
```

### 2. Webhooks
Notifique URLs externas:
```javascript
{
  webhooks: {
    onComplete: "https://api.example.com/webhook",
    method: "POST"
  }
}
```

### 3. Condições
Execute apenas se condição for verdadeira:
```javascript
{
  conditions: {
    checkUrl: "https://api.example.com/status",
    expectedStatus: 200
  }
}
```

### 4. Rate Limiting
Limite execuções:
```javascript
{
  rateLimit: {
    maxExecutions: 10,
    period: "hour"
  }
}
```

## Monitoramento / Monitoring

### Dashboard
```bash
GET /api/dashboard

# Retorna:
{
  totalTasks: 50,
  activeTasks: 45,
  pausedTasks: 3,
  failedTasks: 2,
  recentExecutions: [...],
  upcomingTasks: [...]
}
```

### Métricas
```bash
GET /api/metrics

# Retorna:
{
  successRate: 98.5,
  avgExecutionTime: 1234,
  totalExecutions: 10000,
  failedExecutions: 150
}
```

## Segurança / Security

### Autenticação
Use tokens JWT ou API keys:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/tasks
```

### Rate Limiting
Limite requisições por IP/usuário.

### Validação
Valide todos os parâmetros de entrada.

### Sandbox
Execute scripts em ambiente isolado.

## Escalabilidade / Scalability

### Redis
Use Redis para coordenar múltiplos workers:
```javascript
const Queue = require('bull');
const taskQueue = new Queue('tasks', 'redis://localhost:6379');
```

### Clusters
Distribua tarefas entre múltiplos servidores.

### Priorização
```javascript
{
  priority: "high|medium|low"
}
```

## Boas Práticas / Best Practices

1. ✅ **Idempotência** - Tarefas devem poder ser executadas múltiplas vezes
2. ✅ **Timeout** - Configure timeout para evitar tarefas travadas
3. ✅ **Logs** - Registre tudo para debugging
4. ✅ **Alertas** - Configure alertas para falhas
5. ✅ **Backup** - Backup da configuração de tarefas
6. ✅ **Testes** - Teste tarefas antes de agendar
7. ✅ **Monitoramento** - Monitore execuções e performance

## Próximos Passos / Next Steps

1. ✅ Adicione UI web para gerenciar tarefas
2. ✅ Implemente fila de tarefas com Redis
3. ✅ Configure clustering para alta disponibilidade
4. ✅ Adicione métricas com Prometheus
5. ✅ Implemente webhook callbacks
6. ✅ Adicione suporte a Docker
7. ✅ Configure CI/CD para deploy automático

## Recursos Adicionais / Additional Resources

- [node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [Cron Expression Guide](https://crontab.guru/)
- [Bull Queue](https://optimalbits.github.io/bull/)
- [Agenda.js](https://github.com/agenda/agenda)

---

**Automatize tudo! / Automate everything!**
