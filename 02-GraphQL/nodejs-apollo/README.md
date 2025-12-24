# GraphQL API com Node.js e Apollo Server 🚀

## O que é GraphQL? / What is GraphQL?

**GraphQL** é uma linguagem de consulta para APIs desenvolvida pelo Facebook. Diferente de REST onde você tem múltiplos endpoints fixos, GraphQL tem um único endpoint e o cliente define exatamente quais dados quer receber.

## Diferenças entre GraphQL e REST

### REST
```
GET /api/users/1        → Retorna TODOS os dados do usuário
GET /api/users/1/posts  → Retorna TODOS os posts
GET /api/posts/1/comments → Retorna TODOS os comentários
```
**Problema:** 3 requests, muitos dados desnecessários (over-fetching)

### GraphQL
```graphql
query {
  user(id: 1) {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
```
**Solução:** 1 request, apenas os dados necessários!

## Vantagens do GraphQL / GraphQL Advantages

✅ **Evita Over-fetching** - Cliente pede só o que precisa
✅ **Evita Under-fetching** - Uma query busca dados relacionados
✅ **Tipo Forte** - Schema define exatamente a estrutura
✅ **Documentação Automática** - Schema É a documentação
✅ **Versionamento** - Não precisa versões (adicione campos novos)
✅ **Ferramentas Incríveis** - GraphiQL, Apollo DevTools

## Instalação / Installation

```bash
cd 02-GraphQL/nodejs-apollo

npm install
npm start
```

## Acessando a API / Accessing the API

- **GraphQL Playground:** http://localhost:4000/graphql
- **Endpoint:** http://localhost:4000/graphql

## Schema GraphQL

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

type Query {
  # Buscar todos os usuários
  users: [User!]!
  
  # Buscar usuário por ID
  user(id: ID!): User
  
  # Buscar todos os posts
  posts: [Post!]!
  
  # Buscar post por ID
  post(id: ID!): Post
}

type Mutation {
  # Criar novo usuário
  createUser(name: String!, email: String!, age: Int): User!
  
  # Criar novo post
  createPost(title: String!, content: String!, authorId: ID!): Post!
  
  # Criar comentário
  createComment(text: String!, postId: ID!, authorId: ID!): Comment!
}
```

## Exemplos de Queries / Query Examples

### 1. Buscar todos os usuários
```graphql
query {
  users {
    id
    name
    email
  }
}
```

### 2. Buscar usuário com posts
```graphql
query {
  user(id: "1") {
    name
    email
    posts {
      title
      content
    }
  }
}
```

### 3. Buscar posts com autor e comentários
```graphql
query {
  posts {
    title
    author {
      name
    }
    comments {
      text
      author {
        name
      }
    }
  }
}
```

### 4. Query com aliases (múltiplas queries)
```graphql
query {
  user1: user(id: "1") {
    name
    email
  }
  
  user2: user(id: "2") {
    name
    email
  }
}
```

### 5. Query com fragmentos (reutilizar campos)
```graphql
fragment UserInfo on User {
  id
  name
  email
}

query {
  user(id: "1") {
    ...UserInfo
    posts {
      title
    }
  }
}
```

## Exemplos de Mutations / Mutation Examples

### 1. Criar usuário
```graphql
mutation {
  createUser(
    name: "João Silva"
    email: "joao@email.com"
    age: 30
  ) {
    id
    name
    email
  }
}
```

### 2. Criar post
```graphql
mutation {
  createPost(
    title: "Meu primeiro post"
    content: "Conteúdo do post..."
    authorId: "1"
  ) {
    id
    title
    author {
      name
    }
  }
}
```

### 3. Criar comentário
```graphql
mutation {
  createComment(
    text: "Ótimo post!"
    postId: "1"
    authorId: "2"
  ) {
    id
    text
    author {
      name
    }
  }
}
```

## Testando com JavaScript

```javascript
// Usando fetch
const query = `
  query {
    users {
      name
      email
    }
  }
`;

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Testando com curl

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { name email } }"}'
```

## Conceitos Importantes / Important Concepts

### 1. Schema
Define a estrutura da API - tipos, queries, mutations.

### 2. Resolvers
Funções que retornam dados para cada campo do schema.

### 3. Query
Operação de leitura (como GET em REST).

### 4. Mutation
Operação de escrita (como POST/PUT/DELETE em REST).

### 5. Subscription
Operação em tempo real (recebe atualizações).

### 6. Types
- **Scalar:** String, Int, Float, Boolean, ID
- **Object:** User, Post, etc.
- **Enum:** Valores fixos
- **List:** [Type]
- **Non-null:** Type! (obrigatório)

## Ferramentas / Tools

### Apollo Server
Framework GraphQL para Node.js - o mais popular.

### GraphQL Playground
Interface gráfica para testar queries - vem com Apollo Server.

### Apollo Client
Cliente GraphQL para React, Vue, Angular.

### GraphiQL
Interface alternativa para testes.

## Boas Práticas / Best Practices

### 1. Nomenclatura
- **Queries:** substantivos (user, posts, comments)
- **Mutations:** verbos (createUser, updatePost, deleteComment)

### 2. Paginação
```graphql
type Query {
  posts(page: Int, limit: Int): [Post!]!
}
```

### 3. Erros
```graphql
type UserResult {
  success: Boolean!
  message: String
  user: User
}
```

### 4. Autenticação
Use context para passar usuário autenticado.

### 5. DataLoader
Evite problema N+1 queries.

## Quando NÃO usar GraphQL / When NOT to use GraphQL

- ❌ API muito simples (CRUD básico)
- ❌ Equipe pequena sem experiência
- ❌ Cache HTTP é crítico
- ❌ File upload complexo
- ❌ Clientes fixos que não precisam flexibilidade

## Próximos Passos / Next Steps

1. ✅ Adicione autenticação (JWT)
2. ✅ Implemente paginação
3. ✅ Use DataLoader (evitar N+1)
4. ✅ Adicione subscriptions (tempo real)
5. ✅ Configure Apollo Client no frontend
6. ✅ Adicione validação com Joi
7. ✅ Implemente cache
8. ✅ Configure monitoring

## Recursos Adicionais / Additional Resources

- [GraphQL Official Site](https://graphql.org/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [How to GraphQL](https://www.howtographql.com/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

---

**GraphQL: O cliente no controle! / GraphQL: The client in control!**
