# Espartano

Primeira parte do app: tela de login funcional em HTML, CSS e JavaScript.

## Como testar

Abra `index.html` no navegador.

Credenciais locais:

- Usuário: `admin`
- Senha: `Espartano@123`
- 2FA: desativado

Usuário com 2FA:

- Usuário: `operador`
- Senha: `Operador@123`
- Secret TOTP: `JBSWY3DPEHPK3PXP`

## Fluxos implementados

### Login

- Campo de usuário ou e-mail.
- Campo de senha com mostrar/esconder.
- Manter conectado armazenando token local de demonstração.
- Recuperação de senha com token local e tela `reset.html`.
- Login com redirecionamento para `dashboard.html`.
- Toast de erro com `Credenciais inválidas`.
- Bloqueio por 15 minutos após 5 tentativas falhas.
- 2FA opcional via TOTP para o usuário `operador`.

### Dashboard

- Cards de métricas para ativos agora, total registrado, tráfego enviado e tráfego recebido.
- Mapa mundial interativo com marcadores por IP, tooltip e painel lateral de detalhes.
- Gráfico de tendência 7D/30D e distribuição por sistema operacional.
- Feed de alertas inteligentes com ignorar, marcar como lido e exportação CSV.
- Ações rápidas: sincronização, modo automático e kill switch simulado.

Quando houver backend, substitua a autenticação local em `app.js` por chamadas para a API real de login, envio de e-mail, JWT assinado no servidor e validação TOTP server-side.
