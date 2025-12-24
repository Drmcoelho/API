# Referência Rápida / Quick Reference

Guia rápido de comandos e conceitos essenciais para desenvolvimento de APIs.

## 🚀 Comandos Rápidos / Quick Commands

### Node.js / Express

```bash
# Criar novo projeto
npm init -y

# Instalar Express
npm install express

# Instalar dependências comuns
npm install cors dotenv

# Instalar dev dependencies
npm install --save-dev nodemon

# Executar servidor
node server.js

# Executar com auto-reload
npx nodemon server.js
```

### Python / FastAPI

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar FastAPI
pip install fastapi uvicorn

# Instalar com requirements.txt
pip install -r requirements.txt

# Executar servidor
uvicorn main:app --reload

# Executar em porta específica
uvicorn main:app --reload --port 8080
```

### Testar APIs / Test APIs

```bash
# GET request
curl http://localhost:3000/api/items

# POST request
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Item", "price": 100}'

# PUT request
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 150}'

# DELETE request
curl -X DELETE http://localhost:3000/api/items/1

# Com autenticação
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/protected
```

## 📊 Status Codes HTTP / HTTP Status Codes

### Sucesso (2xx)
- **200 OK** - Requisição bem-sucedida
- **201 Created** - Recurso criado com sucesso
- **204 No Content** - Sucesso, mas sem conteúdo para retornar

### Redirecionamento (3xx)
- **301 Moved Permanently** - Recurso movido permanentemente
- **304 Not Modified** - Conteúdo não foi modificado (cache)

### Erro do Cliente (4xx)
- **400 Bad Request** - Requisição inválida
- **401 Unauthorized** - Não autenticado
- **403 Forbidden** - Autenticado mas sem permissão
- **404 Not Found** - Recurso não encontrado
- **409 Conflict** - Conflito (ex: email duplicado)
- **422 Unprocessable Entity** - Validação falhou
- **429 Too Many Requests** - Rate limit excedido

### Erro do Servidor (5xx)
- **500 Internal Server Error** - Erro no servidor
- **502 Bad Gateway** - Gateway inválido
- **503 Service Unavailable** - Serviço indisponível
- **504 Gateway Timeout** - Timeout do gateway

## 🔐 Autenticação / Authentication

### JWT (JSON Web Token)

```javascript
// Gerar token
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id },
  'SECRET_KEY',
  { expiresIn: '1h' }
);

// Verificar token
try {
  const decoded = jwt.verify(token, 'SECRET_KEY');
  console.log(decoded.userId);
} catch (error) {
  console.log('Token inválido');
}

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
```

## 📝 Validação de Dados / Data Validation

### Com Joi (Node.js)

```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).max(150),
  password: Joi.string().min(8).required()
});

const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

### Com Pydantic (Python)

```python
from pydantic import BaseModel, EmailStr, Field

class User(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    age: int = Field(None, ge=0, le=150)
    password: str = Field(..., min_length=8)

# Uso
try:
    user = User(**data)
except ValidationError as e:
    print(e.errors())
```

## 🗄️ Banco de Dados / Database

### PostgreSQL

```javascript
// Node.js com pg
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Query
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Insert
await pool.query(
  'INSERT INTO users(name, email) VALUES($1, $2)',
  [name, email]
);
```

### MongoDB

```javascript
// Node.js com mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number
});

const User = mongoose.model('User', userSchema);

// Criar
const user = await User.create({ name, email, age });

// Buscar
const users = await User.find({ age: { $gt: 18 } });

// Atualizar
await User.findByIdAndUpdate(id, { name: 'Novo Nome' });

// Deletar
await User.findByIdAndDelete(id);
```

## 🔄 Async/Await Pattern

### JavaScript

```javascript
// Função assíncrona
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Múltiplas operações em paralelo
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);
```

### Python

```python
import asyncio
import aiohttp

async def fetch_user(session, user_id):
    async with session.get(f'/api/users/{user_id}') as response:
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        # Múltiplas requisições em paralelo
        tasks = [fetch_user(session, i) for i in range(1, 11)]
        users = await asyncio.gather(*tasks)
```

## 🛡️ Segurança / Security

### Hash de Senha / Password Hashing

```javascript
// bcrypt (Node.js)
const bcrypt = require('bcrypt');

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verificar password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### CORS

```javascript
// Express
const cors = require('cors');

app.use(cors({
  origin: ['https://meusite.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests
});

app.use('/api/', limiter);
```

## 📦 Padrões de Resposta / Response Patterns

### Sucesso

```javascript
// Item único
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João"
  }
}

// Lista
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Erro

```javascript
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
```

## 🧪 Testes / Testing

### Jest (Node.js)

```javascript
describe('User API', () => {
  test('should create user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'João', email: 'joao@email.com' });
    
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

### pytest (Python)

```python
def test_create_user(client):
    response = client.post('/api/users', json={
        'name': 'João',
        'email': 'joao@email.com'
    })
    
    assert response.status_code == 201
    assert 'id' in response.json()['data']
```

## 📊 Logging

### Winston (Node.js)

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

logger.info('Server started');
logger.error('Error occurred', { error });
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://...
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## 🔍 Debugging

### Node.js

```bash
# Modo debug
node --inspect server.js

# Com breakpoint automático
node --inspect-brk server.js

# Chrome DevTools: chrome://inspect
```

### Python

```bash
# pdb (Python debugger)
import pdb; pdb.set_trace()

# ou use breakpoint() (Python 3.7+)
breakpoint()
```

---

**Mantenha este guia salvo para referência rápida! / Keep this guide saved for quick reference!**
