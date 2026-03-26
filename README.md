# Horse Flow

Horse Flow e um SaaS web para gestao completa de cavalos com foco em manejo, saude, reproducao e alertas automaticos.

## Estrutura

- `frontend/`: aplicacao React
- `backend/`: API REST em Node.js + Express
- `database/`: script SQL MySQL

## Requisitos

- Node.js 20+
- MySQL 8+
- npm 10+

## 1. Banco de dados

1. Crie um banco MySQL chamado `horse_flow`.
2. Execute o script [database/schema.sql](C:\Users\FLP\Desktop\Horse%20Flow\database\schema.sql).

## 2. Backend

1. Entre em [backend](C:\Users\FLP\Desktop\Horse%20Flow\backend).
2. Rode `npm install`.
3. Copie [backend/.env.example](C:\Users\FLP\Desktop\Horse%20Flow\backend\.env.example) para `.env`.
4. Ajuste as credenciais do MySQL e o `JWT_SECRET`.
5. Rode `npm run dev`.

## 3. Frontend

1. Entre em [frontend](C:\Users\FLP\Desktop\Horse%20Flow\frontend).
2. Rode `npm install`.
3. Copie [frontend/.env.example](C:\Users\FLP\Desktop\Horse%20Flow\frontend\.env.example) para `.env`.
4. Configure `VITE_API_URL=http://localhost:4000/api`.
5. Rode `npm run dev`.

## 4. Deploy no Netlify

1. Publique este repositorio no Netlify usando a raiz do projeto `Horse Flow`.
2. O arquivo [netlify.toml](C:\Users\FLP\Desktop\Horse%20Flow\netlify.toml) ja define:
   - `base = "frontend"`
   - `command = "npm run build"`
   - `publish = "dist"`
3. O arquivo [frontend/public/_redirects](C:\Users\FLP\Desktop\Horse%20Flow\frontend\public\_redirects) garante o fallback da SPA.
4. No painel do Netlify, configure a variavel de ambiente `VITE_API_URL` com a URL publica da sua API.
5. O backend Node.js + MySQL nao roda no Netlify como site estatico.
6. Para producao, hospede a API separadamente e aponte o frontend para ela usando `VITE_API_URL`.

Variavel para copiar no Netlify:

```env
VITE_API_URL=https://SEU-BACKEND.onrender.com/api
```

## 5. Deploy da API

1. O arquivo [render.yaml](C:\Users\FLP\Desktop\Horse%20Flow\render.yaml) deixa a API pronta para publicar no Render.
2. Crie um banco MySQL hospedado externamente e importe [schema.sql](C:\Users\FLP\Desktop\Horse%20Flow\database\schema.sql).
3. No Render, publique este repositorio e mantenha o servico `horse-flow-api`.
4. Preencha as variaveis obrigatorias:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SSL`
   - `JWT_SECRET`
   - `CLIENT_URLS`
5. Em `CLIENT_URLS`, informe o dominio do Netlify e o dominio de preview, separados por virgula quando necessario.
6. Depois copie a URL publica da API e use esse valor no `VITE_API_URL` do Netlify.

Variaveis para copiar no Render:

```env
PORT=4000
DB_HOST=SEU_HOST_MYSQL
DB_PORT=3306
DB_NAME=horse_flow
DB_USER=SEU_USUARIO
DB_PASSWORD=SUA_SENHA
DB_SSL=false
JWT_SECRET=uma_chave_bem_forte
JWT_EXPIRES_IN=12h
CLIENT_URLS=https://SEU-SITE.netlify.app,https://deploy-preview-1--SEU-SITE.netlify.app
```

## 6. Fluxo completo de publicacao

1. Suba o banco MySQL e importe [schema.sql](C:\Users\FLP\Desktop\Horse%20Flow\database\schema.sql).
2. Publique o backend no Render usando [render.yaml](C:\Users\FLP\Desktop\Horse%20Flow\render.yaml).
3. Confirme que a URL `https://SEU-BACKEND.onrender.com/api/health` responde com `ok`.
4. Configure `VITE_API_URL` no Netlify com `https://SEU-BACKEND.onrender.com/api`.
5. Publique o frontend no Netlify usando a raiz do repositorio.
6. Teste login, cadastro e criacao de cavalo no site publicado.

## 7. Arquitetura de producao

- Frontend React hospedado no Netlify
- API Node.js hospedada no Render
- Banco MySQL hospedado separadamente
- CORS configurado por `CLIENT_URLS`
- Payload JSON preparado para fotos em base64

## Preparado para evolucao

Esta base foi organizada para expansao futura com:

- app mobile consumindo a mesma API
- integracao com sensores e GPS
- notificacoes externas
- escalabilidade multiempresa
