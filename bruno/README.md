# Estoquei API (Bruno)

Abra esta pasta como **coleção Bruno** (`Open Collection` → selecione `bruno/`).

## Variáveis via `.env`

1. Copie o exemplo: `cp bruno/.env.example bruno/.env`
2. Preencha `bruno/.env`. O Bruno lê esse arquivo na raiz da coleção e as variáveis ficam disponíveis como `process.env.*`.
3. No app Bruno, selecione o ambiente **local** (arquivo `environments/local.bru`), que mapeia:

| Variável no `.env`       | Uso nas requisições |
|--------------------------|---------------------|
| `ESTOQUEI_BASE_URL`      | `{{baseUrl}}`       |
| `ESTOQUEI_JWT`           | `{{jwt}}` (Bearer)  |
| `ESTOQUEI_PRODUCT_ID`    | `{{productId}}`     |

O token JWT deve ter claim `sub` (string) e ser assinado com o mesmo `JWT_SECRET` da API. Na **raiz do repositório** (onde está o `.env` da API):

```bash
node -e "require('dotenv').config(); const jwt=require('jsonwebtoken'); console.log(jwt.sign({sub:'dev-user'}, process.env.JWT_SECRET, {expiresIn:'7d'}));"
```

Cole o valor impresso em `ESTOQUEI_JWT` no `bruno/.env`.

## Endpoints

| Pasta     | Requisição                    | Método | Caminho |
|-----------|-------------------------------|--------|---------|
| Health    | Health Check                  | GET    | `/health` |
| Products  | List Products                 | GET    | `/products` |
| Products  | Get Product By Id             | GET    | `/products/:id` |
| Products  | Create Product                | POST   | `/products` |
| Products  | Update Product                | PUT    | `/products/:id` |
| Products  | Delete Product                | DELETE | `/products/:id` |
| Movements | List Movements                | GET    | `/movements` |
| Movements | List Movements By Product     | GET    | `/movements?productId=` |
| Movements | Create Movement               | POST   | `/movements` |

Todas as rotas, exceto **Health Check**, exigem `Authorization: Bearer {{jwt}}`.

## CLI

Com [@usebruno/cli](https://www.npmjs.com/package/@usebruno/cli):

```bash
npx @usebruno/cli run bruno --env local
```
