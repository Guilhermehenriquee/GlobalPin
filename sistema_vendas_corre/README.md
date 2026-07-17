# Sistema de Vendas Corre

App web/PWA para vendas, estoque por vendedor, entregas, caixa e roteamento de contatos do WhatsApp por bairro.

## Rodar localmente

```bash
npm run dev
```

Abra:

```text
http://localhost:5173
```

## Deploy no Render

Configure o serviço como Web Service usando Node.

```text
Build Command: npm install
Start Command: npm start
```

O servidor usa automaticamente a porta enviada pelo Render em `PORT`.

## WhatsApp

O servidor local recebe contatos por webhook:

```text
POST /api/whatsapp/contact
POST /api/whatsapp/message
GET /api/whatsapp/events
POST /api/whatsapp/reply
```

Exemplo de contato:

```json
{
  "name": "DUCA - Ponta Aguda",
  "phone": "554792625104",
  "body": "Contato salvo no WhatsApp: DUCA - Ponta Aguda"
}
```

Para envio real via WhatsApp Cloud API, configure:

```bash
WHATSAPP_CLOUD_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```
