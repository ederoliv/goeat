# GoEat: Escopo do Produto e Roadmap

Referência de produto: iFood. Estratégia: entregar por fases, cada uma utilizável por si só.

## Perfis de usuário

### Cliente
Consome a plataforma. Pode navegar sem conta, mas precisa se cadastrar para finalizar um pedido.

### Restaurante (admin)
Dono ou gerente. Acessa o painel privado depois que o cadastro do restaurante for aprovado.

### Administrador da plataforma (futuro)
Equipe GoEat. Aprova restaurantes, gerencia cidades e categorias, modera conteúdo.

## Funcionalidades

### Lado do cliente (público)
- Home com busca, filtro por cidade e categorias, listagem de restaurantes e promoções
- Página do restaurante: cardápio por seção, produtos com opções/adicionais, status aberto/fechado, horários
- Carrinho (um restaurante por vez), observações do item
- Cadastro e login (e-mail/senha; login social depois)
- Perfil com **endereços** salvos (CRUD, endereço padrão)
- Checkout: escolha entre **retirada no local** ou **entrega no endereço**, forma de pagamento na entrega/retirada e resumo com taxa de entrega
- Formas de pagamento (apenas escolha, sem cobrança online): crédito, débito, Pix ou dinheiro (com opção de informar troco)
- Histórico e status do pedido (sem rastreamento de entrega)
- Avaliações (futuro)

### Lado do restaurante (privado)
- Cadastro do restaurante (dados, endereço, cidade, categorias, logo, telefone) com status `PENDING_APPROVAL` até aprovação
- Login e gestão de conta
- **Horários de funcionamento** por dia da semana (aberto/fechado, abertura/fechamento)
- **Cardápio**: seções (menus), produtos (nome, descrição, preço, foto, disponibilidade), grupos de opções e adicionais
- Pausar/ativar loja manualmente
- Recebimento e gestão de pedidos (aceitar, preparar, marcar como pronto/saiu para entrega, concluir, cancelar)
- Taxa de entrega e pedido mínimo
- Definir se aceita retirada, entrega ou ambos, e quais formas de pagamento aceita
- Relatórios de vendas (futuro)
- Cupons e promoções (futuro)

## Decisões de produto (vigentes)

- **Autenticação**: JWT.
- **Logística fora de escopo**: a entrega é responsabilidade do restaurante, que usa entregadores próprios (motoboys contratados diretamente). A plataforma não tem entregadores, atribuição de corrida, rastreamento nem rastreabilidade. Isso será reavaliado no futuro.
- **Tipo de atendimento**: no pedido, o cliente escolhe `PICKUP` (retira no estabelecimento) ou `DELIVERY` (recebe no endereço cadastrado). Endereço só é exigido em `DELIVERY`.
- **Pagamento**: a plataforma não processa pagamentos. O cliente apenas escolhe a forma (`CREDIT`, `DEBIT`, `PIX`, `CASH`) e paga na maquininha do estabelecimento ou na que o motoboy leva. Para `CASH`, pode informar o valor para troco.

## Entidades (visão de domínio)

Já modeladas em [entidade.md](./entidade.md): `Restaurant`, `City`, `Category`, `BusinessHours`, `Address` (embeddable), `RestaurantStatus`.

A modelar nas próximas fases:

| Entidade | Observações |
|----------|-------------|
| `User` | Credenciais e papel (`CUSTOMER`, `RESTAURANT_OWNER`, `ADMIN`) |
| `Customer` | Perfil do cliente, telefone, CPF opcional |
| `CustomerAddress` | Endereços do cliente, com apelido e flag de padrão |
| `Menu` / `MenuSection` | Seções do cardápio de um restaurante |
| `Product` | Item do cardápio, preço em centavos, disponibilidade |
| `OptionGroup` / `Option` | Adicionais e variações do produto |
| `Order` / `OrderItem` | Pedido com snapshot de preços e endereço; `fulfillmentType` (`PICKUP`/`DELIVERY`); `paymentMethod` (`CREDIT`/`DEBIT`/`PIX`/`CASH`); `changeFor` opcional (troco) |
| `Coupon` | Cupons e promoções |

Pontos de atenção: valores monetários em centavos (inteiro); `Order` guarda cópia dos preços e do endereço no momento da compra; `publicId` (UUID) em tudo que é exposto na URL ou na API.

## Fluxo de status do pedido

`CREATED → ACCEPTED → PREPARING → READY → COMPLETED`

- `READY` significa "pronto para retirada" (`PICKUP`) ou "saiu para entrega" (`DELIVERY`); o restaurante apenas atualiza o status manualmente.
- `COMPLETED` é marcado pelo restaurante quando o pedido foi entregue/retirado e pago.
- Cancelamento (`CANCELED`) possível em `CREATED` e `ACCEPTED`.

## Roadmap

### Fase 0: Base (feito)
- [x] Setup Vite + React + TanStack Router + Tailwind/shadcn
- [x] Home com lista de restaurantes (mock)
- [x] Página de cardápio e modal de produto
- [x] Carrinho (`CartContext`, `CartSidebar`)
- [x] Footer, deploy na Vercel

### Fase 1: Backend e dados reais
- [x] Backend criado (Goeat API, .NET); contrato em `docs/api-contract.md`
- [x] Restaurantes e cardápio (menu com seções e produtos) consumidos da API; cidades e categorias ainda não existem na API
- [x] Mocks de `src/data` removidos
- [x] Filtro por culinária e busca na home; aberto/fechado vem de `isOpen`

### Fase 2: Autenticação
- [x] Cadastro/login de clientes (JWT)
- [ ] Cadastro/login de restaurantes (JWT)
- [x] Interceptor no axios envia o token; 401 limpa a sessão (sem refresh token na API)
- [ ] Rotas protegidas por papel no front (`beforeLoad` do TanStack Router)

### Fase 3: Painel do restaurante
- [ ] Layout do admin (`/admin/*`)
- [ ] Cadastro e edição do restaurante, horários de funcionamento
- [ ] CRUD de seções e produtos, upload de imagens
- [ ] Aprovação de restaurantes (`PENDING_APPROVAL → ACTIVE`)

### Fase 4: Pedido e checkout do cliente
- [ ] Endereços do cliente (CRUD)
- [ ] Checkout com escolha retirada/entrega, endereço (só na entrega) e forma de pagamento (crédito, débito, Pix, dinheiro)
- [x] Criação de pedido (`POST /orders`, endereço em texto livre) e histórico (`/orders`)
- [ ] Gestão de pedidos no painel do restaurante

### Fase 5 (futuro): Pagamentos online
- [ ] Integração com gateway (Pix e cartão) e webhooks de confirmação

### Fase 6 (futuro): Evolução
- [ ] Cupons e promoções, avaliações, notificações em tempo real, relatórios
- [ ] Logística: entregadores da plataforma, atribuição e rastreamento
- [ ] Reavaliar SSR (TanStack Start ou Next.js) se o SEO das páginas de restaurante se tornar prioridade

## Decisões em aberto

- Armazenamento de imagens (S3, Cloudinary...)
- JWT: onde guardar o token no front (memória + refresh token em cookie httpOnly é o mais seguro) e tempo de expiração
- Gateway de pagamento, quando os pagamentos online entrarem no escopo

## Estado atual frente à API

Implementado no front: login e cadastro de cliente e de restaurante (`/login`, `/register`, `/restaurant/login`, `/restaurant/register`), pedido com ou sem conta (entrega ou retirada, pagamento Dinheiro/Crédito/Débito/Pix registrado, sem cobrança), acompanhamento por código (`/track/<código>`), histórico do cliente (`/orders`) e painel do restaurante (`/dashboard`): pedidos recebidos com filtro por status, CRUD de seções e produtos, disponibilidade, perfil e abrir/fechar a loja.

## Lacunas entre o produto e a API atual

A API ainda não suporta, e portanto o front não implementa: alterar o status do pedido (o restaurante só vê os pedidos, que ficam em `Pending`), endereços salvos do cliente (o endereço é texto livre por pedido), observações por item, horários de funcionamento, cidades/categorias, imagem/endereço do restaurante, upload de imagens (só URL), troco para pagamento em dinheiro, refresh token e criação do cardápio dos restaurantes de demonstração (ids 1 a 4 não têm login).
