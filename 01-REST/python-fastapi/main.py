"""
API REST EDUCACIONAL COM FASTAPI
Educational REST API with FastAPI

Este é um exemplo completo e didático de uma API REST usando Python e FastAPI.
This is a complete and didactic example of a REST API using Python and FastAPI.

CONCEITOS IMPORTANTES / IMPORTANT CONCEPTS:
- FastAPI: Framework web moderno e de alta performance
- Pydantic: Validação automática de dados
- Type Hints: Tipos estáticos em Python
- Async/Await: Programação assíncrona
- OpenAPI: Documentação automática
"""

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uvicorn

# CRIAÇÃO DA APLICAÇÃO / APPLICATION CREATION
app = FastAPI(
    title="API REST Educacional / Educational REST API",
    description="API completa para aprender REST com FastAPI / Complete API to learn REST with FastAPI",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# MODELOS PYDANTIC / PYDANTIC MODELS
# Modelos definem a estrutura dos dados e fazem validação automática
# Models define data structure and perform automatic validation

class ProductBase(BaseModel):
    """Modelo base para produto / Base product model"""
    name: str = Field(..., min_length=1, max_length=100, description="Nome do produto")
    description: Optional[str] = Field(None, max_length=500, description="Descrição do produto")
    price: float = Field(..., gt=0, description="Preço deve ser maior que zero")
    in_stock: bool = Field(True, description="Produto em estoque")

class ProductCreate(ProductBase):
    """Modelo para criar produto / Model to create product"""
    pass

class ProductUpdate(BaseModel):
    """Modelo para atualizar produto / Model to update product"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    in_stock: Optional[bool] = None

class Product(ProductBase):
    """Modelo completo do produto / Complete product model"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Laptop",
                "description": "High-performance laptop",
                "price": 1299.99,
                "in_stock": True,
                "created_at": "2024-01-01T12:00:00",
                "updated_at": None
            }
        }

# DADOS EM MEMÓRIA / IN-MEMORY DATA
# Em produção, use um banco de dados real (PostgreSQL, MongoDB, etc.)
products_db: List[Product] = [
    Product(
        id=1,
        name="Laptop",
        description="Dell XPS 15",
        price=1499.99,
        in_stock=True,
        created_at=datetime.now()
    ),
    Product(
        id=2,
        name="Mouse",
        description="Logitech MX Master 3",
        price=99.99,
        in_stock=True,
        created_at=datetime.now()
    ),
    Product(
        id=3,
        name="Teclado",
        description="Mechanical RGB Keyboard",
        price=149.99,
        in_stock=False,
        created_at=datetime.now()
    )
]

next_id = 4

# ROTAS / ROUTES

@app.get("/", tags=["Home"])
async def root():
    """
    Rota raiz - Informações sobre a API
    Root route - API information
    """
    return {
        "message": "Bem-vindo à API REST com FastAPI! / Welcome to REST API with FastAPI!",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "GET /api/products": "Lista todos os produtos",
            "GET /api/products/{id}": "Busca produto por ID",
            "POST /api/products": "Cria novo produto",
            "PUT /api/products/{id}": "Atualiza produto",
            "DELETE /api/products/{id}": "Deleta produto"
        }
    }

@app.get("/api/products", response_model=List[Product], tags=["Products"])
async def get_products(
    min_price: Optional[float] = Query(None, description="Preço mínimo", ge=0),
    max_price: Optional[float] = Query(None, description="Preço máximo", ge=0),
    in_stock: Optional[bool] = Query(None, description="Filtrar por disponibilidade"),
    search: Optional[str] = Query(None, description="Buscar por nome ou descrição")
):
    """
    Lista todos os produtos com filtros opcionais
    List all products with optional filters
    
    - **min_price**: Filtra produtos com preço >= valor
    - **max_price**: Filtra produtos com preço <= valor
    - **in_stock**: Filtra produtos em estoque
    - **search**: Busca por nome ou descrição
    """
    filtered_products = products_db.copy()
    
    if min_price is not None:
        filtered_products = [p for p in filtered_products if p.price >= min_price]
    
    if max_price is not None:
        filtered_products = [p for p in filtered_products if p.price <= max_price]
    
    if in_stock is not None:
        filtered_products = [p for p in filtered_products if p.in_stock == in_stock]
    
    if search:
        search_lower = search.lower()
        filtered_products = [
            p for p in filtered_products
            if search_lower in p.name.lower() or 
               (p.description and search_lower in p.description.lower())
        ]
    
    return filtered_products

@app.get("/api/products/{product_id}", response_model=Product, tags=["Products"])
async def get_product(product_id: int):
    """
    Busca um produto específico por ID
    Get a specific product by ID
    """
    product = next((p for p in products_db if p.id == product_id), None)
    
    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Produto com ID {product_id} não encontrado / Product with ID {product_id} not found"
        )
    
    return product

@app.post("/api/products", response_model=Product, status_code=201, tags=["Products"])
async def create_product(product: ProductCreate):
    """
    Cria um novo produto
    Create a new product
    
    Body example:
    ```json
    {
        "name": "Smartphone",
        "description": "Latest model",
        "price": 899.99,
        "in_stock": true
    }
    ```
    """
    global next_id
    
    new_product = Product(
        id=next_id,
        **product.model_dump(),
        created_at=datetime.now()
    )
    
    products_db.append(new_product)
    next_id += 1
    
    return new_product

@app.put("/api/products/{product_id}", response_model=Product, tags=["Products"])
async def update_product(product_id: int, product_update: ProductUpdate):
    """
    Atualiza um produto existente
    Update an existing product
    
    Apenas os campos fornecidos serão atualizados
    Only provided fields will be updated
    """
    product_index = next((i for i, p in enumerate(products_db) if p.id == product_id), None)
    
    if product_index is None:
        raise HTTPException(
            status_code=404,
            detail=f"Produto com ID {product_id} não encontrado / Product with ID {product_id} not found"
        )
    
    stored_product = products_db[product_index]
    update_data = product_update.model_dump(exclude_unset=True)
    
    updated_product = stored_product.model_copy(update={
        **update_data,
        "updated_at": datetime.now()
    })
    
    products_db[product_index] = updated_product
    
    return updated_product

@app.delete("/api/products/{product_id}", tags=["Products"])
async def delete_product(product_id: int):
    """
    Deleta um produto
    Delete a product
    """
    product_index = next((i for i, p in enumerate(products_db) if p.id == product_id), None)
    
    if product_index is None:
        raise HTTPException(
            status_code=404,
            detail=f"Produto com ID {product_id} não encontrado / Product with ID {product_id} not found"
        )
    
    deleted_product = products_db.pop(product_index)
    
    return {
        "success": True,
        "message": f"Produto '{deleted_product.name}' deletado com sucesso / Product '{deleted_product.name}' deleted successfully",
        "data": deleted_product
    }

# HEALTH CHECK ENDPOINT
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Endpoint de health check
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "products_count": len(products_db)
    }

# EXECUÇÃO DO SERVIDOR / SERVER EXECUTION
if __name__ == "__main__":
    print("""
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚡ API REST COM FASTAPI / REST API WITH FASTAPI ⚡      ║
║                                                           ║
║   Servidor rodando em / Server running on:               ║
║   http://localhost:8000                                  ║
║                                                           ║
║   📚 Documentação Interativa / Interactive Docs:         ║
║   http://localhost:8000/docs                             ║
║                                                           ║
║   📖 Documentação Alternativa / Alternative Docs:        ║
║   http://localhost:8000/redoc                            ║
║                                                           ║
║   ✅ Pronto para receber requisições!                     ║
║   ✅ Ready to receive requests!                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload durante desenvolvimento
        log_level="info"
    )
