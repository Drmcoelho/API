# REST API com Python e FastAPI ⚡

## O que é FastAPI? / What is FastAPI?

**FastAPI** é um framework web moderno e de alta performance para construir APIs com Python. É baseado em padrões como OpenAPI e JSON Schema.

## Características / Features

✅ **Rápido** - Um dos frameworks Python mais rápidos
✅ **Fácil** - Sintaxe simples e intuitiva
✅ **Automático** - Documentação automática (Swagger/OpenAPI)
✅ **Validação** - Validação automática de dados com Pydantic
✅ **Type Hints** - Usa type hints do Python para validação
✅ **Async** - Suporte nativo a programação assíncrona

## Instalação / Installation

```bash
# Entre na pasta do projeto
cd 01-REST/python-fastapi

# Crie um ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Execute o servidor
uvicorn main:app --reload

# Ou use o script direto
python main.py
```

## Acessando a API / Accessing the API

- **API Base:** http://localhost:8000
- **Documentação Interativa (Swagger):** http://localhost:8000/docs
- **Documentação Alternativa (ReDoc):** http://localhost:8000/redoc

## Testando a API / Testing the API

### 1. Usando a documentação interativa
Acesse http://localhost:8000/docs e teste diretamente no navegador!

### 2. Usando curl

```bash
# Listar todos os produtos
curl http://localhost:8000/api/products

# Criar um novo produto
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Smartphone", "description": "iPhone 15", "price": 999.99, "in_stock": true}'

# Buscar produto por ID
curl http://localhost:8000/api/products/1

# Atualizar produto
curl -X PUT http://localhost:8000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Smartphone Pro", "price": 1099.99}'

# Deletar produto
curl -X DELETE http://localhost:8000/api/products/1
```

## Estrutura do Código / Code Structure

```
python-fastapi/
├── main.py              # Aplicação principal
├── requirements.txt     # Dependências Python
└── README.md           # Este arquivo
```

## Conceitos FastAPI / FastAPI Concepts

### 1. Path Operations (Decoradores)
```python
@app.get("/items")      # Leitura
@app.post("/items")     # Criação
@app.put("/items/{id}") # Atualização
@app.delete("/items")   # Deleção
```

### 2. Pydantic Models
Modelos para validação automática de dados:
```python
class Product(BaseModel):
    name: str
    price: float
    in_stock: bool = True
```

### 3. Dependency Injection
Sistema poderoso de injeção de dependências.

### 4. Automatic Documentation
Documentação gerada automaticamente a partir do código!

## Vantagens do FastAPI / FastAPI Advantages

1. **Performance** - Comparável a Node.js e Go
2. **Produtividade** - Menos código, mais funcionalidades
3. **Validação Automática** - Pydantic valida tudo
4. **Documentação Automática** - Swagger UI incluído
5. **Type Safety** - Erros detectados antes da execução
6. **Async Support** - Perfeito para I/O intensivo

## Próximos Passos / Next Steps

1. ✅ Integre com banco de dados (SQLAlchemy + PostgreSQL)
2. ✅ Adicione autenticação (OAuth2 + JWT)
3. ✅ Implemente paginação
4. ✅ Configure CORS para produção
5. ✅ Adicione testes com pytest
6. ✅ Configure Docker
7. ✅ Deploy na nuvem (AWS, GCP, Heroku)

## Recursos Adicionais / Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

---

**Dica:** A documentação interativa em /docs é perfeita para experimentar a API!
