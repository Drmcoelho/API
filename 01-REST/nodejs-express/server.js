/**
 * API REST EDUCACIONAL COM EXPRESS
 * Educational REST API with Express
 * 
 * Este é um exemplo completo e didático de uma API REST usando Node.js e Express.
 * This is a complete and didactic example of a REST API using Node.js and Express.
 * 
 * CONCEITOS IMPORTANTES / IMPORTANT CONCEPTS:
 * - REST: Representational State Transfer
 * - CRUD: Create, Read, Update, Delete
 * - HTTP Methods: GET, POST, PUT, DELETE
 * - Status Codes: 200, 201, 404, 500, etc.
 */

const express = require('express');
const cors = require('cors');

// Inicializa a aplicação Express / Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE SECTION
// Middlewares são funções que processam requisições antes de chegarem às rotas
// Middlewares are functions that process requests before they reach the routes

// Parse JSON bodies (para ler dados JSON nas requisições)
app.use(express.json());

// Enable CORS (permite requisições de outros domínios)
app.use(cors());

// Logger middleware (registra todas as requisições)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Passa para o próximo middleware/rota
});

// DADOS EM MEMÓRIA / IN-MEMORY DATA
// Em produção, você usaria um banco de dados real (MongoDB, PostgreSQL, etc.)
// In production, you would use a real database (MongoDB, PostgreSQL, etc.)
let items = [
  { id: 1, name: 'Laptop', description: 'MacBook Pro 16"', price: 2500, createdAt: new Date() },
  { id: 2, name: 'Mouse', description: 'Logitech MX Master 3', price: 100, createdAt: new Date() },
  { id: 3, name: 'Keyboard', description: 'Mechanical RGB', price: 150, createdAt: new Date() }
];

let nextId = 4; // Contador para novos IDs

// ROTAS / ROUTES
// Cada rota mapeia um endpoint para uma função específica

/**
 * ROTA RAIZ / ROOT ROUTE
 * GET /
 * Retorna informações sobre a API
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API REST Educacional! / Welcome to the Educational REST API!',
    version: '1.0.0',
    endpoints: {
      'GET /api/items': 'Lista todos os itens / List all items',
      'GET /api/items/:id': 'Busca um item específico / Get specific item',
      'POST /api/items': 'Cria um novo item / Create new item',
      'PUT /api/items/:id': 'Atualiza um item / Update item',
      'DELETE /api/items/:id': 'Deleta um item / Delete item'
    },
    tutorial: 'Veja o README.md para exemplos de uso / See README.md for usage examples'
  });
});

/**
 * LISTAR TODOS OS ITENS / LIST ALL ITEMS
 * GET /api/items
 * Retorna array com todos os itens
 */
app.get('/api/items', (req, res) => {
  // Query parameters para filtros opcionais
  const { minPrice, maxPrice, search } = req.query;
  
  let filteredItems = items;
  
  // Filtro por preço mínimo
  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }
  
  // Filtro por preço máximo
  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }
  
  // Busca por nome ou descrição
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    count: filteredItems.length,
    data: filteredItems
  });
});

/**
 * BUSCAR ITEM POR ID / GET ITEM BY ID
 * GET /api/items/:id
 * Retorna um item específico
 */
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item não encontrado / Item not found'
    });
  }
  
  res.json({
    success: true,
    data: item
  });
});

/**
 * CRIAR NOVO ITEM / CREATE NEW ITEM
 * POST /api/items
 * Body: { name, description, price }
 */
app.post('/api/items', (req, res) => {
  const { name, description, price } = req.body;
  
  // Validação básica / Basic validation
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Nome e preço são obrigatórios / Name and price are required'
    });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      success: false,
      error: 'Preço deve ser um número positivo / Price must be a positive number'
    });
  }
  
  // Cria o novo item
  const newItem = {
    id: nextId++,
    name,
    description: description || '',
    price,
    createdAt: new Date()
  };
  
  items.push(newItem);
  
  // Status 201 = Created
  res.status(201).json({
    success: true,
    message: 'Item criado com sucesso / Item created successfully',
    data: newItem
  });
});

/**
 * ATUALIZAR ITEM / UPDATE ITEM
 * PUT /api/items/:id
 * Body: { name?, description?, price? }
 */
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item não encontrado / Item not found'
    });
  }
  
  const { name, description, price } = req.body;
  
  // Validação
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Preço deve ser um número positivo / Price must be a positive number'
    });
  }
  
  // Atualiza apenas os campos fornecidos
  const updatedItem = {
    ...items[itemIndex],
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price }),
    updatedAt: new Date()
  };
  
  items[itemIndex] = updatedItem;
  
  res.json({
    success: true,
    message: 'Item atualizado com sucesso / Item updated successfully',
    data: updatedItem
  });
});

/**
 * DELETAR ITEM / DELETE ITEM
 * DELETE /api/items/:id
 */
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item não encontrado / Item not found'
    });
  }
  
  const deletedItem = items[itemIndex];
  items.splice(itemIndex, 1);
  
  res.json({
    success: true,
    message: 'Item deletado com sucesso / Item deleted successfully',
    data: deletedItem
  });
});

// TRATAMENTO DE ERROS / ERROR HANDLING
// Middleware de erro global (deve ser o último)
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor / Internal server error',
    message: err.message
  });
});

// Rota 404 - deve ser a última rota
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada / Route not found'
  });
});

// INICIA O SERVIDOR / START SERVER
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 API REST EDUCACIONAL / EDUCATIONAL REST API 🚀       ║
║                                                           ║
║   Servidor rodando em / Server running on:               ║
║   http://localhost:${PORT}                                    ║
║                                                           ║
║   📚 Documentação / Documentation:                        ║
║   GET http://localhost:${PORT}/                               ║
║                                                           ║
║   ✅ Pronto para receber requisições!                     ║
║   ✅ Ready to receive requests!                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Export para testes / Export for testing
module.exports = app;
