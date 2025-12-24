# Melhores Práticas para APIs / API Best Practices

## 📋 Índice / Table of Contents

1. [Design de API](#design-de-api)
2. [Segurança](#segurança)
3. [Performance](#performance)
4. [Documentação](#documentação)
5. [Versionamento](#versionamento)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Testes](#testes)
8. [Monitoramento](#monitoramento)

## 🎨 Design de API

### 1. Use Substantivos para Recursos (REST)

✅ **Correto:**
```
GET    /api/users
GET    /api/users/123
POST   /api/users
PUT    /api/users/123
DELETE /api/users/123
```

❌ **Incorreto:**
```
GET    /api/getUsers
POST   /api/createUser
PUT    /api/updateUser/123
DELETE /api/deleteUser/123
```

### 2. Use Verbos HTTP Apropriados

- **GET** - Recuperar recurso(s)
- **POST** - Criar novo recurso
- **PUT** - Atualizar recurso completo
- **PATCH** - Atualizar parcialmente
- **DELETE** - Remover recurso

### 3. Estrutura de URLs Hierárquica

✅ **Correto:**
```
GET /api/users/123/posts
GET /api/users/123/posts/456/comments
```

❌ **Incorreto:**
```
GET /api/getUserPosts?userId=123
GET /api/getPostComments?postId=456
```

### 4. Filtragem, Ordenação e Paginação

```bash
# Filtragem
GET /api/products?category=electronics&price_min=100

# Ordenação
GET /api/users?sort=name&order=asc

# Paginação
GET /api/posts?page=2&limit=20

# Combinado
GET /api/products?category=books&sort=price&order=desc&page=1&limit=10
```

### 5. Use Plural para Coleções

✅ **Correto:**
```
GET /api/users
GET /api/products
```

❌ **Incorreto:**
```
GET /api/user
GET /api/product
```

### 6. Respostas Consistentes

```javascript
// Sucesso
{
  "success": true,
  "data": { /* dados */ },
  "message": "Operação concluída com sucesso"
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}

// Lista com metadados
{
  "success": true,
  "data": [ /* itens */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## 🔒 Segurança

### 1. Sempre Use HTTPS

```nginx
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

### 2. Autenticação e Autorização

#### JWT (JSON Web Tokens)
```javascript
// Gerar token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### OAuth 2.0
Para APIs públicas que terceiros vão consumir.

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);
```

### 4. Validação de Input

```javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().min(0).max(150)
});

const { error, value } = schema.validate(req.body);
```

### 5. SQL Injection Prevention

✅ **Correto (Prepared Statements):**
```javascript
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

❌ **Incorreto:**
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query);
```

### 6. XSS Prevention

```javascript
// Sanitize input
const clean = require('xss');
const safeContent = clean(userInput);

// Ou use bibliotecas como DOMPurify
```

### 7. CORS Configurado Corretamente

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://meusite.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### 8. Nunca Exponha Informações Sensíveis

❌ **Incorreto:**
```javascript
{
  "error": "Database connection failed: password='secret123' at host='db.internal'"
}
```

✅ **Correto:**
```javascript
{
  "error": "Erro interno do servidor. Por favor, tente novamente mais tarde."
}
```

## ⚡ Performance

### 1. Cache

```javascript
// Cache com Redis
const redis = require('redis');
const client = redis.createClient();

// Cache por 1 hora
client.setex(key, 3600, JSON.stringify(data));

// Ler cache
const cached = await client.get(key);
if (cached) {
  return JSON.parse(cached);
}
```

### 2. Compressão

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Paginação

```javascript
// Sempre pagine listas grandes
GET /api/users?page=1&limit=50

// Resposta
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "hasNext": true
  }
}
```

### 4. Campos Específicos (GraphQL-like)

```javascript
// Permitir cliente escolher campos
GET /api/users?fields=id,name,email

// Resposta apenas com campos solicitados
[
  { "id": 1, "name": "João", "email": "joao@email.com" }
]
```

### 5. Queries Otimizadas

```javascript
// Evite N+1 queries
// ❌ Incorreto
const users = await User.findAll();
for (let user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Correto
const users = await User.findAll({
  include: [{ model: Post }]
});
```

### 6. Índices no Banco

```sql
-- Crie índices para campos frequentemente buscados
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_author ON posts(author_id);
```

## 📚 Documentação

### 1. OpenAPI/Swagger (REST)

```yaml
openapi: 3.0.0
info:
  title: Minha API
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: Lista usuários
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Sucesso
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

### 2. README Completo

Deve incluir:
- Descrição do projeto
- Instalação
- Configuração
- Exemplos de uso
- Endpoints disponíveis
- Autenticação
- Rate limits
- Códigos de erro
- Changelog

### 3. Comentários no Código

```javascript
/**
 * Cria um novo usuário
 * 
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.email - Email do usuário
 * @param {string} userData.password - Senha (min 8 caracteres)
 * @returns {Promise<User>} Usuário criado
 * @throws {ValidationError} Se dados inválidos
 * @throws {DuplicateError} Se email já existe
 */
async function createUser(userData) {
  // ...
}
```

## 🔄 Versionamento

### 1. Versionamento na URL

✅ **Recomendado:**
```
GET /api/v1/users
GET /api/v2/users
```

### 2. Versionamento no Header

```bash
GET /api/users
Accept: application/vnd.myapi.v1+json
```

### 3. Deprecação Gradual

```javascript
{
  "data": { /* ... */ },
  "warnings": [
    {
      "message": "Este endpoint será descontinuado em 01/12/2024",
      "migration": "Use /api/v2/users"
    }
  ]
}
```

## ❌ Tratamento de Erros

### 1. Use Status Codes HTTP Corretos

- **200** OK - Sucesso
- **201** Created - Recurso criado
- **204** No Content - Sucesso sem corpo
- **400** Bad Request - Dados inválidos
- **401** Unauthorized - Não autenticado
- **403** Forbidden - Sem permissão
- **404** Not Found - Recurso não existe
- **409** Conflict - Conflito (ex: email duplicado)
- **422** Unprocessable Entity - Validação falhou
- **429** Too Many Requests - Rate limit
- **500** Internal Server Error - Erro no servidor
- **503** Service Unavailable - Serviço indisponível

### 2. Mensagens de Erro Claras

```javascript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Formato de email inválido",
        "value": "invalidemail"
      },
      {
        "field": "age",
        "message": "Idade deve ser entre 0 e 150",
        "value": -5
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/users",
    "requestId": "abc-123-def"
  }
}
```

### 3. Códigos de Erro Customizados

```javascript
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED'
};
```

## 🧪 Testes

### 1. Testes Unitários

```javascript
describe('User Service', () => {
  it('should create user with valid data', async () => {
    const userData = {
      name: 'João',
      email: 'joao@email.com'
    };
    
    const user = await userService.create(userData);
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('João');
  });
  
  it('should throw error for invalid email', async () => {
    const userData = {
      name: 'João',
      email: 'invalidemail'
    };
    
    await expect(userService.create(userData))
      .rejects
      .toThrow('Email inválido');
  });
});
```

### 2. Testes de Integração

```javascript
describe('POST /api/users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'João',
        email: 'joao@email.com'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

### 3. Cobertura de Testes

Objetivo: mínimo 80% de cobertura

```bash
npm test -- --coverage
```

## 📊 Monitoramento

### 1. Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log de requisições
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});
```

### 2. Métricas

```javascript
// Prometheus
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});
```

### 3. Health Checks

```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalApi: await checkExternalApi()
    }
  };
  
  res.json(health);
});
```

## 🚀 Deploy

### 1. Variáveis de Ambiente

```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=seu-segredo-super-secreto
REDIS_URL=redis://...
```

### 2. Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 3. CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy
        run: ./deploy.sh
```

## ✅ Checklist de Lançamento / Launch Checklist

Antes de lançar sua API em produção:

- [ ] HTTPS configurado
- [ ] Autenticação implementada
- [ ] Rate limiting ativado
- [ ] Validação de input em todos os endpoints
- [ ] Tratamento de erros adequado
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Backup automático
- [ ] Documentação completa
- [ ] Testes com cobertura >80%
- [ ] Health check endpoint
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Cache implementado
- [ ] Compressão ativada
- [ ] Versionamento definido

---

**APIs bem projetadas são um prazer de usar! / Well-designed APIs are a pleasure to use!**
