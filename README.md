# estoquei — backend

API REST para o sistema de controle de estoque com gerenciamento de produtos e movimentações de inventário.

**Deploy:** backend no [Render](https://render.com) · banco de dados no [Supabase](https://supabase.com)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js ≥ 20 |
| Framework | Express 4 + TypeScript |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL 16 |
| Validação | Zod 3 |
| Autenticação | JSON Web Token (jsonwebtoken) |
| Testes | Vitest 4 |
| Coleção de API | Bruno |

---

## Arquitetura de pastas

O projeto segue uma **arquitetura modular em camadas com padrão Repository**. Cada módulo de negócio é autossuficiente e contém suas próprias camadas (controller, service, repository, entity), sem acoplamento entre módulos.

```
src/
├── app.ts                          # Fábrica do app Express (createApp)
├── server.ts                       # Ponto de entrada — inicia o servidor
├── env.ts                          # Validação de variáveis de ambiente (Zod)
│
├── modules/                        # Domínios de negócio
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   └── login/
│   │       ├── login.controller.ts
│   │       ├── login.service.ts
│   │       ├── login.dto.ts
│   │       └── login.service.test.ts
│   ├── products/
│   │   ├── product.routes.ts
│   │   ├── shared/                 # Entidade, DTOs e contratos compartilhados
│   │   │   ├── product.entity.ts
│   │   │   ├── product.dto.ts
│   │   │   └── product.entity.test.ts
│   │   ├── repositories/
│   │   │   └── product.repository.ts
│   │   ├── create-product/
│   │   ├── list-products/
│   │   ├── get-product-by-id/
│   │   ├── update-product/
│   │   └── delete-product/        # Cada use case: controller + service + test
│   └── inventory-movements/
│       ├── shared/
│       ├── repositories/
│       ├── utils/                  # Funções puras testadas isoladamente
│       ├── create-movement/
│       └── list-movements/
│
├── shared/                         # Código sem domínio de negócio
│   ├── base/
│   │   ├── abstract.controller.ts  # success() e dispatch() reutilizáveis
│   │   ├── abstract.service.ts     # Contrato genérico de serviço
│   │   └── abstract.repository.ts  # Contrato genérico de repositório
│   ├── database/
│   │   └── prisma.ts               # Singleton do PrismaClient
│   ├── errors/
│   │   ├── AppError.ts             # Classe base de erros de domínio
│   │   ├── application.errors.ts   # NotFoundError, BadRequestError, etc.
│   │   └── resolveToHttpError.ts   # Converte AppError → HttpError
│   └── middlewares/
│       ├── auth.ts                 # Verificação de JWT
│       ├── validate.ts             # Validação de body com Zod
│       └── errorHandler.ts         # Handler global de erros
│
├── tests/
│   └── setup.ts                    # Configuração global do Vitest
└── types/
    └── express.d.ts                # Extensão de tipos do Express (req.user)
```

---

## Arquitetura modular em camadas

Cada módulo segue um fluxo unidirecional entre camadas:

```
Router → Middleware (validate / auth) → Controller → Service → Repository → Prisma
```

### Camadas

| Camada | Responsabilidade |
|---|---|
| **Router** | Monta rotas e injeta dependências manualmente via construtor |
| **Middleware** | Validação de body (Zod) e verificação de JWT antes do controller |
| **Controller** | Recebe a requisição HTTP, delega ao service e responde via `success()` |
| **Service** — use case | Regra de negócio pura; depende de interfaces, não de implementações concretas |
| **Repository** | Único ponto de acesso ao banco; recebe `PrismaClient` por injeção de construtor |
| **Entity** | Modelo de domínio imutável com `fromPrisma()` para mapear o banco e `toJSON()` para a resposta |
| **DTO** | Esquema Zod com inferência de tipos; validado pelo middleware antes de chegar ao controller |

### Padrão Repository

Os repositórios são definidos por **interface** e injetados nos services por construtor. Isso desacopla a regra de negócio do Prisma e permite substituir a implementação nos testes com mocks tipados.

```
IProductRepository (interface)
    └── ProductRepository (implementação Prisma)
```

### Injeção de dependência

Não há container de DI — a montagem é feita manualmente nas rotas:

```typescript
// product.routes.ts
const repository = new ProductRepository(prisma)
const service = new CreateProductService(repository)
const controller = new CreateProductController(service)
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
DATABASE_URL=postgresql://estoquei:estoquei_dev@localhost:5435/estoquei
JWT_SECRET=change-me-in-production
LOGIN_USERNAME=admin
LOGIN_PASSWORD=secret
PORT=3333
NODE_ENV=development
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | sim | String de conexão PostgreSQL |
| `JWT_SECRET` | sim | Chave para assinar tokens JWT |
| `LOGIN_USERNAME` | sim | Usuário fixo para autenticação |
| `LOGIN_PASSWORD` | sim | Senha fixa para autenticação |
| `PORT` | não | Porta do servidor (padrão: `3333`) |
| `NODE_ENV` | não | `development` \| `production` \| `test` (padrão: `development`) |

---

## Banco de dados

O projeto usa **Prisma** como ORM e **PostgreSQL 16** como banco de dados.

### Modelos

| Modelo | Campos principais |
|---|---|
| `Product` | `id` (UUID), `name`, `description`, `imageUrl`, `emoji`, `quantity`, `status`, `createdAt`, `updatedAt` |
| `InventoryMovement` | `id` (auto-increment), `productId` (FK), `type`, `quantity`, `counterPartyName`, `date`, `createdAt` |

`InventoryMovement` tem cascata de exclusão em relação a `Product`.

---

## Rodando localmente

### Pré-requisitos

- Node.js ≥ 20
- Docker (para o PostgreSQL local)

### Passos

```bash
# 1. Instalar dependências e gerar o cliente Prisma
npm install

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Subir o banco de dados PostgreSQL via Docker
npm run docker:up

# 4. Aplicar as migrations no banco
npm run db:migrate

# 5. Iniciar o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### Outros comandos úteis

```bash
# Build de produção
npm run build

# Iniciar build compilado
npm run start

# Parar o container do banco
npm run docker:down

# Ver logs do container
npm run docker:logs

# Sincronizar schema sem criar migration (útil em desenvolvimento)
npm run db:push
```

---

## Testes

Os testes ficam colocalizados com o código-fonte (`*.test.ts`).

```bash
npm test
```

Tipos de teste aplicados:

- **Unitários** — services, entidades e funções utilitárias isoladas com mocks dos repositórios
- **Middlewares** — validação, autenticação e handler de erros testados diretamente

A configuração do Vitest está em [vitest.config.ts](vitest.config.ts). O arquivo [src/tests/setup.ts](src/tests/setup.ts) define as variáveis de ambiente para o ambiente de teste.

---

## Coleção de API (Bruno)

A pasta [bruno/](bruno/) contém uma coleção [Bruno](https://www.usebruno.com/) com todos os endpoints documentados e prontos para executar.

```
bruno/
├── Health/
│   └── Health Check.bru
├── Products/
│   ├── Create Product.bru
│   ├── List Products.bru
│   ├── Get Product By Id.bru
│   ├── Update Product.bru
│   ├── Delete Product.bru
│   └── Movements/
│       ├── Create Movement.bru
│       └── List Movements.bru
└── environments/
    └── local.bru               # Aponta para http://localhost:3333
```

Para usar, importe a pasta `bruno/` no app do Bruno e selecione o ambiente `local`.

---

## Integração contínua

O workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) executa em todo push para `main`:

1. `npm install`
2. `npm test`

---

## Endpoints

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/health` | não | Health check |
| `POST` | `/auth/login` | não | Gera token JWT |
| `GET` | `/products` | sim | Lista todos os produtos |
| `POST` | `/products` | sim | Cria produto |
| `GET` | `/products/:id` | sim | Busca produto por ID |
| `PUT` | `/products/:id` | sim | Atualiza produto |
| `DELETE` | `/products/:id` | sim | Remove produto |
| `POST` | `/products/:id/movements` | sim | Registra movimentação |
| `GET` | `/products/:id/movements` | sim | Lista movimentações do produto |

Rotas autenticadas exigem o header `Authorization: Bearer <token>`.
