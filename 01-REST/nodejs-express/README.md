# REST API com Node.js e Express 🚀

## O que é uma API REST? / What is a REST API?

**REST (Representational State Transfer)** é um estilo arquitetural para desenvolver serviços web. Uma API REST utiliza os métodos HTTP para realizar operações CRUD:

- **GET** - Recuperar dados (Read)
- **POST** - Criar novos recursos (Create)
- **PUT** - Atualizar recursos (Update)
- **DELETE** - Remover recursos (Delete)

## O que você vai aprender / What you'll learn

✅ Como criar uma API REST do zero
✅ Estrutura de um projeto Node.js
✅ Uso do framework Express
✅ Operações CRUD completas
✅ Validação de dados
✅ Tratamento de erros
✅ Boas práticas REST

## Pré-requisitos / Prerequisites

- Node.js (v14+)
- npm ou yarn
- Conhecimento básico de JavaScript

## Instalação / Installation

```bash
# Entre na pasta do projeto
cd 01-REST/nodejs-express

# Instale as dependências
npm install

# Execute o servidor
npm start

# Para desenvolvimento (com auto-reload)
npm run dev
```

## Testando a API / Testing the API

### 1. Listar todos os itens
```bash
curl http://localhost:3000/api/items
```

### 2. Criar um novo item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Notebook", "description": "Dell XPS 15", "price": 1500}'
```

### 3. Buscar um item específico
```bash
curl http://localhost:3000/api/items/1
```

### 4. Atualizar um item
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Notebook Updated", "price": 1400}'
```

### 5. Deletar um item
```bash
curl -X DELETE http://localhost:3000/api/items/1
```

## Estrutura do Código / Code Structure

```
nodejs-express/
├── server.js           # Arquivo principal da aplicação
├── package.json        # Dependências e scripts
├── routes/            
│   └── items.js       # Rotas da API
├── controllers/       
│   └── itemController.js  # Lógica de negócio
└── README.md          # Este arquivo
```

## Conceitos Importantes / Important Concepts

### 1. Middleware
Middlewares são funções que têm acesso ao objeto de requisição (req), resposta (res), e a próxima função middleware.

### 2. Rotas (Routes)
Definem os endpoints da API e mapeiam para os controladores.

### 3. Controladores (Controllers)
Contêm a lógica de negócio da aplicação.

### 4. Status Codes HTTP
- **200** - OK (sucesso)
- **201** - Created (recurso criado)
- **400** - Bad Request (requisição inválida)
- **404** - Not Found (recurso não encontrado)
- **500** - Internal Server Error (erro no servidor)

## Próximos Passos / Next Steps

1. ✅ Adicione um banco de dados (MongoDB, PostgreSQL)
2. ✅ Implemente autenticação (JWT)
3. ✅ Adicione validação com Joi ou Express Validator
4. ✅ Configure CORS para aceitar requisições de outros domínios
5. ✅ Adicione testes unitários e de integração
6. ✅ Implemente paginação para grandes conjuntos de dados
7. ✅ Adicione documentação com Swagger/OpenAPI

## Recursos Adicionais / Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

**Dica:** Experimente modificar o código, adicione novos endpoints, e veja como tudo funciona na prática!
