# Estoquei API (Bruno)

Coleção: abrir a pasta `bruno/` no Bruno.

Ambiente **local** (`environments/local.bru`) lê `bruno/.env` (modelo: `.env.example`).

| `bruno/.env`          | Variável na request |
|-----------------------|---------------------|
| `ESTOQUEI_BASE_URL`   | `{{baseUrl}}`       |
| `ESTOQUEI_JWT`       | `{{jwt}}`           |
| `ESTOQUEI_PRODUCT_ID`| `{{productId}}`     |

JWT: payload com `sub` (string), assinado com o `JWT_SECRET` da API. Gerar na raiz do repo:  
`node -e "require('dotenv').config(); const j=require('jsonwebtoken'); console.log(j.sign({sub:'dev-user'}, process.env.JWT_SECRET, {expiresIn:'7d'}));"`

## Endpoints

| Pasta     | Requisição                 | Método | Caminho |
|-----------|----------------------------|--------|---------|
| Health    | Health Check               | GET    | `/health` |
| Products  | List Products              | GET    | `/products` |
| Products  | Get Product By Id          | GET    | `/products/:id` |
| Products  | Create Product             | POST   | `/products` |
| Products  | Update Product             | PUT    | `/products/:id` |
| Products  | Delete Product             | DELETE | `/products/:id` |
| Products  | List Movements             | GET    | `/products/:productId/movements` |
| Products  | Create Movement            | POST   | `/products/:productId/movements` |

Rotas exceto `/health`: header `Authorization: Bearer {{jwt}}`.

## CLI

```bash
npx @usebruno/cli run bruno --env local
```
