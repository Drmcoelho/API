/**
 * GRAPHQL API COM APOLLO SERVER
 * GraphQL API with Apollo Server
 * 
 * Este é um exemplo educacional de uma API GraphQL usando Apollo Server.
 * This is an educational example of a GraphQL API using Apollo Server.
 * 
 * CONCEITOS IMPORTANTES / IMPORTANT CONCEPTS:
 * - Schema: Define a estrutura da API
 * - Resolvers: Funções que retornam dados
 * - Query: Operações de leitura
 * - Mutation: Operações de escrita
 * - Type Safety: Schema garante tipos corretos
 */

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// SCHEMA - Define a estrutura da API
// Schema defines the API structure
const typeDefs = `#graphql
  # Tipo User - Representa um usuário
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  # Tipo Post - Representa um post
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    createdAt: String!
  }

  # Tipo Comment - Representa um comentário
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
    createdAt: String!
  }

  # Queries - Operações de leitura
  type Query {
    # Retorna informações sobre a API
    info: String!
    
    # Retorna todos os usuários
    users: [User!]!
    
    # Retorna um usuário específico por ID
    user(id: ID!): User
    
    # Retorna todos os posts
    posts: [Post!]!
    
    # Retorna um post específico por ID
    post(id: ID!): Post
    
    # Retorna todos os comentários
    comments: [Comment!]!
  }

  # Mutations - Operações de escrita
  type Mutation {
    # Cria um novo usuário
    createUser(name: String!, email: String!, age: Int): User!
    
    # Cria um novo post
    createPost(title: String!, content: String!, authorId: ID!): Post!
    
    # Cria um novo comentário
    createComment(text: String!, postId: ID!, authorId: ID!): Comment!
    
    # Atualiza um usuário
    updateUser(id: ID!, name: String, email: String, age: Int): User!
    
    # Deleta um usuário
    deleteUser(id: ID!): Boolean!
  }
`;

// DADOS EM MEMÓRIA / IN-MEMORY DATA
// Em produção, use banco de dados real
let users = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', age: 30 },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', age: 25 },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', age: 35 }
];

let posts = [
  {
    id: '1',
    title: 'Introdução ao GraphQL',
    content: 'GraphQL é uma linguagem de consulta para APIs...',
    authorId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Por que usar GraphQL?',
    content: 'GraphQL resolve problemas de over-fetching e under-fetching...',
    authorId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'REST vs GraphQL',
    content: 'Comparação entre REST e GraphQL...',
    authorId: '2',
    createdAt: new Date().toISOString()
  }
];

let comments = [
  {
    id: '1',
    text: 'Ótimo post! Muito esclarecedor.',
    postId: '1',
    authorId: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Adorei a explicação!',
    postId: '1',
    authorId: '3',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    text: 'Concordo plenamente.',
    postId: '2',
    authorId: '3',
    createdAt: new Date().toISOString()
  }
];

let nextUserId = 4;
let nextPostId = 4;
let nextCommentId = 4;

// RESOLVERS - Funções que retornam dados
// Resolvers are functions that return data
const resolvers = {
  // Queries - Operações de leitura
  Query: {
    info: () => {
      return '🚀 GraphQL API Educacional - Aprenda GraphQL fazendo!';
    },
    
    users: () => {
      return users;
    },
    
    user: (parent, args) => {
      return users.find(user => user.id === args.id);
    },
    
    posts: () => {
      return posts;
    },
    
    post: (parent, args) => {
      return posts.find(post => post.id === args.id);
    },
    
    comments: () => {
      return comments;
    }
  },

  // Mutations - Operações de escrita
  Mutation: {
    createUser: (parent, args) => {
      // Validação de email com padrão mais robusto
      // RFC 5322 simplified pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(args.email)) {
        throw new Error('Email inválido / Invalid email');
      }
      
      // Verifica se email já existe
      if (users.some(u => u.email === args.email)) {
        throw new Error('Email já cadastrado / Email already registered');
      }
      
      const newUser = {
        id: String(nextUserId++),
        name: args.name,
        email: args.email,
        age: args.age || null
      };
      
      users.push(newUser);
      return newUser;
    },
    
    createPost: (parent, args) => {
      // Verifica se autor existe
      const author = users.find(u => u.id === args.authorId);
      if (!author) {
        throw new Error('Autor não encontrado / Author not found');
      }
      
      const newPost = {
        id: String(nextPostId++),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      return newPost;
    },
    
    createComment: (parent, args) => {
      // Verifica se post existe
      const post = posts.find(p => p.id === args.postId);
      if (!post) {
        throw new Error('Post não encontrado / Post not found');
      }
      
      // Verifica se autor existe
      const author = users.find(u => u.id === args.authorId);
      if (!author) {
        throw new Error('Autor não encontrado / Author not found');
      }
      
      const newComment = {
        id: String(nextCommentId++),
        text: args.text,
        postId: args.postId,
        authorId: args.authorId,
        createdAt: new Date().toISOString()
      };
      
      comments.push(newComment);
      return newComment;
    },
    
    updateUser: (parent, args) => {
      const userIndex = users.findIndex(u => u.id === args.id);
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado / User not found');
      }
      
      // Validação de email se fornecido com padrão mais robusto
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (args.email && !emailPattern.test(args.email)) {
        throw new Error('Email inválido / Invalid email');
      }
      
      // Atualiza apenas campos fornecidos
      const updatedUser = {
        ...users[userIndex],
        ...(args.name && { name: args.name }),
        ...(args.email && { email: args.email }),
        ...(args.age !== undefined && { age: args.age })
      };
      
      users[userIndex] = updatedUser;
      return updatedUser;
    },
    
    deleteUser: (parent, args) => {
      const userIndex = users.findIndex(u => u.id === args.id);
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado / User not found');
      }
      
      // Remove usuário
      users.splice(userIndex, 1);
      
      // Remove posts do usuário
      posts = posts.filter(p => p.authorId !== args.id);
      
      // Remove comentários do usuário
      comments = comments.filter(c => c.authorId !== args.id);
      
      return true;
    }
  },

  // Resolvers de tipos - Resolvem campos relacionados
  // Type resolvers - Resolve related fields
  User: {
    posts: (parent) => {
      // Retorna todos os posts do usuário
      return posts.filter(post => post.authorId === parent.id);
    }
  },

  Post: {
    author: (parent) => {
      // Retorna o autor do post
      return users.find(user => user.id === parent.authorId);
    },
    
    comments: (parent) => {
      // Retorna todos os comentários do post
      return comments.filter(comment => comment.postId === parent.id);
    }
  },

  Comment: {
    author: (parent) => {
      // Retorna o autor do comentário
      return users.find(user => user.id === parent.authorId);
    },
    
    post: (parent) => {
      // Retorna o post do comentário
      return posts.find(post => post.id === parent.postId);
    }
  }
};

// CRIAR SERVIDOR APOLLO / CREATE APOLLO SERVER
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Configurações adicionais
  formatError: (error) => {
    // Formata erros para melhor legibilidade
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path
    };
  }
});

// INICIAR SERVIDOR / START SERVER
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 GRAPHQL API COM APOLLO SERVER                       ║
║      GraphQL API with Apollo Server                      ║
║                                                           ║
║   Servidor rodando em / Server running on:               ║
║   ${url}                                      ║
║                                                           ║
║   📚 GraphQL Playground (teste queries):                 ║
║   ${url}graphql                               ║
║                                                           ║
║   💡 Exemplo de query:                                    ║
║   query {                                                ║
║     users {                                              ║
║       name                                               ║
║       email                                              ║
║       posts {                                            ║
║         title                                            ║
║       }                                                  ║
║     }                                                    ║
║   }                                                      ║
║                                                           ║
║   ✅ Pronto para receber queries!                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

startServer().catch(error => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});
