# TITANOR

E-commerce premium de artigos esportivos com Next.js App Router, React, TypeScript, TailwindCSS, Prisma ORM, PostgreSQL, autenticação segura e checkout preparado para Stripe.

## Stack

- Next.js App Router
- React + TypeScript
- TailwindCSS
- PostgreSQL + Prisma ORM
- Auth própria com cookie HTTP-only assinado
- Zod para validação
- Bcrypt para senha criptografada
- Stripe Checkout preparado para Pix, cartão e boleto
- SEO com metadata, Open Graph, sitemap e robots

## Funcionalidades

- Home premium com hero, atletas, categorias, destaques, mais vendidos, promoções, depoimentos e benefícios.
- Catálogo com busca por nome, marca, modalidade, preço, tamanho, cor, categoria e promoção.
- Página de produto com galeria, preço, parcelamento, compra, carrinho, frete, descrições, especificações, avaliações, segurança e troca.
- Carrinho com adicionar, remover, alterar quantidade, subtotal, frete, cupom e finalização.
- Checkout com cliente, endereço, envio, Pix, cartão, boleto, resumo e confirmação.
- Área do cliente com cadastro, login, pedidos, rastreamento, endereço, favoritos e trocas.
- Admin com vendas, pedidos recentes, faturamento, mais vendidos, estoque baixo, clientes, cupons, produtos e status de pedido.
- Prisma com models: User, Product, Category, Order, OrderItem, Cart, CartItem, Address, Payment, Coupon, Review, Wishlist e Banner.

## Dashboard e painel administrativo

A dashboard fica em:

```txt
http://localhost:3000/admin
```

Depois de rodar migrate e seed, entre com:

- Login: `admin` ou `admin@titanor.com.br`
- Senha: `Titanor@2026`

Rotas do admin:

- `/admin` dashboard geral
- `/admin/produtos` cadastro e controle de produtos
- `/admin/pedidos` gerenciamento de pedidos e status
- `/admin/categorias` categorias do catálogo
- `/admin/cupons` cupons e promoções
- `/admin/clientes` clientes cadastrados
- `/admin/banners` banners e vitrines da home

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse `http://localhost:3000`.

## Banco PostgreSQL

Configure `DATABASE_URL` no `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/titanor?schema=public"
```

O seed cria produtos fictícios, categorias, banners, cupons e um usuário administrador:

- E-mail: `admin@titanor.com.br`
- Senha: `Titanor@2026`

## Pagamentos

O checkout usa Stripe Checkout quando `STRIPE_SECRET_KEY` estiver configurada. Ative Pix, boleto e cartão no Dashboard Stripe para que os métodos apareçam dinamicamente no Checkout.

Sem chave Stripe, o projeto usa modo demonstrativo e exibe confirmação com Pix copia e cola fictício:

```env
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS="true"
```

## Variáveis

Veja `.env.example` para:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Deploy no Render

O projeto inclui `render.yaml` para Blueprint com web service + PostgreSQL. Se usar Blueprint, o Render cria o banco, injeta `DATABASE_URL`, roda migrations, roda seed e faz build automaticamente.

Se estiver configurando manualmente no painel do Render, use:

Build Command:

```bash
npm install && npm run render-build
```

Start Command:

```bash
npm run start
```

Variáveis obrigatórias:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="uma-chave-grande-e-segura"
NEXT_PUBLIC_APP_URL="https://titanor.onrender.com"
ADMIN_EMAIL="admin@titanor.com.br"
ADMIN_PASSWORD="Titanor@2026"
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS="true"
```

Para controle real da loja, crie um PostgreSQL no Render e copie a **Internal Database URL** para `DATABASE_URL`. O script `npm run render-build` chama `npm run db:setup`, que roda `prisma migrate deploy` e `npm run db:seed`, então as tabelas, categorias e produtos iniciais são criados durante o deploy.

O `npm run start` também executa `db:setup` quando `DATABASE_URL` existe. Isso ajuda o serviço no Render a se recuperar caso o banco tenha sido conectado depois do primeiro deploy.

O cadastro administrativo de produtos, categorias e banners usa upload de imagens em vez de URL externa. Os uploads aceitam JPG, PNG e WebP até 4 MB e são salvos no PostgreSQL como imagem validada, evitando perda de arquivos em restart/deploy no Render.

Se `DATABASE_URL` não estiver configurada, o login não quebra a página, mas o admin só funciona como fallback emergencial e não salva produtos.

## Scripts

```bash
npm run dev
npm run build
npm run render-build
npm run start
npm run lint
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:setup
npm run db:seed
npm run studio
```

## Próximos passos de produção

- Conectar webhooks Stripe para confirmar pagamento e atualizar pedidos.
- Adicionar cálculo real de frete com Correios ou Melhor Envio.
- Persistir carrinho anônimo no banco e ativar recuperação de carrinho.
- Configurar HTTPS, domínio, backups, logs e monitoramento.
