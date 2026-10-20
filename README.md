# GoEat

Plataforma de delivery de comida no estilo iFood. Restaurantes se cadastram e gerenciam seus cardápios; clientes encontram restaurantes, fazem pedidos e pagam pela plataforma.

O projeto é construído de forma incremental. Veja o escopo completo e o roadmap em [PRODUCT.md](./PRODUCT.md), o modelo de dados em [entidade.md](./entidade.md) e o guia visual em [PROJECT_RULES.md](./PROJECT_RULES.md).

## Visão geral

Existem dois lados na plataforma:

| Lado | Quem usa | O que faz |
|------|----------|-----------|
| **Público / Cliente** | Consumidor final | Busca restaurantes, vê cardápio, monta carrinho, escolhe endereço e pagamento, acompanha pedidos |
| **Privado / Admin** | Dono do restaurante | Cadastra o restaurante, gerencia menus, produtos, horários e pedidos recebidos |

## Stack (frontend)

- React 19 + TypeScript + Vite 7
- TanStack Router (rotas por arquivo em `src/routes`; `routeTree.gen.ts` é gerado)
- Tailwind CSS 4 + shadcn/ui (Radix) + lucide-react
- Axios (`src/config/api.ts`, base URL em `VITE_API_BASE_URL`)
- Deploy na Vercel (`vercel.json` reescreve tudo para `index.html`, por ser SPA)

O backend é a **Goeat API** (ASP.NET Core / .NET 10, monólito modular, PostgreSQL), em repositório separado (localmente em `C:\Users\Eder\source\repos\Goeat API`). O contrato com o front é `docs/api-contract.md`, cópia do `docs/api-contract.md` da API; as rotas em OpenAPI estão em `docs/openapi.json`.

A API é a fonte da verdade. Antes de criar ou alterar chamadas, tipos ou rotas no front, releia o contrato original na API e atualize a cópia. Restaurantes, cardápio, cadastro/login (JWT) e pedidos já consomem a API real (`src/services`).

## Decisões atuais

- Autenticação via JWT, com dois perfis (`customer` e `restaurant`) e logins separados.
- Sem logística na plataforma: a entrega é feita por entregadores do próprio restaurante, sem rastreamento.
- Pedidos podem ser feitos sem conta (o cliente guarda o link `/track/<código>`).
- Sem pagamento online: o cliente escolhe crédito, débito, Pix ou dinheiro e paga na maquininha do estabelecimento ou do motoboy.
- O cliente escolhe retirada no local ou entrega no endereço cadastrado.

Detalhes em [PRODUCT.md](./PRODUCT.md).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint
```

Variáveis de ambiente (`.env`):

```
VITE_API_BASE_URL=http://localhost:8080
```

## Estrutura

```
src/
  components/   componentes de UI (CartSidebar, ProductModal, Footer, ui/ do shadcn)
  config/       configuração (cliente axios)
  context/      estado global (CartContext)
  services/     chamadas à API (restaurants, auth, orders)
  types/        tipos do contrato da API (api.ts)
  hooks/        useRequest
  layout/       Navbar
  pages/        telas (IndexPage, MenuPage)
  routes/       rotas do TanStack Router (/, /menu/$restaurantId, /login, /register, /restaurant/login, /restaurant/register, /dashboard, /orders, /track/$trackingCode)
```

## Convenções

- Tipos do front espelham o contrato da API (`docs/api-contract.md`), não o `entidade.md`.
- Hoje a API identifica restaurantes por `id` inteiro. Se passar a expor `slug`/`publicId`, o contrato vai dizer.
- Cores e estilo: siga o [PROJECT_RULES.md](./PROJECT_RULES.md).
