<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

<h1 align="center">💈 Navalha de Ouro</h1>

<p align="center">
  <strong>Sistema Web Profissional para Barbearias</strong><br/>
  Agendamento online · Painel administrativo · Configuração dinâmica do site
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-endpoints-da-api">API</a> •
  <a href="#-licença">Licença</a>
</p>

---

## 📋 Funcionalidades

### Site Público
- Landing page profissional com design **Black & Gold**
- Seções: Hero, Sobre, Serviços, Equipe, Unidades e Contato
- Sistema de agendamento online com seleção de serviço, data e horário
- Botão flutuante do WhatsApp com número dinâmico
- Paleta de cores configurável em tempo real pelo admin
- 100% responsivo (Mobile First)

### Painel Administrativo
- Autenticação JWT com login seguro e rate limiting
- **Dashboard** com estatísticas em tempo real (agendamentos, receita, serviços populares)
- **Serviços** — CRUD completo com upload de imagens via Cloudinary
- **Agendamentos** — filtros por período/status, atualização de status, exportação CSV
- **Horários** — bloqueio de horários específicos por data
- **Configurações** — WhatsApp, notificações, lembretes automáticos (cron)
- **Configuração Web** — personalização completa do site:

| Aba | O que configura |
|-----|-----------------|
| Logo | Logos do header e footer (upload + dimensões) |
| Cores | Paleta de 7 cores com preview ao vivo |
| Sobre | Título, subtítulo, textos, imagens e horário |
| Serviços | CRUD de serviços com imagem |
| Equipe | Membros, cargos, fotos e redes sociais |
| Unidades | Localizações com imagens |
| Redes Sociais | Instagram, Facebook, YouTube, Twitter |

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Uso |
|------------|-----|
| **Node.js** + **Express** | Servidor HTTP e API REST |
| **TypeScript** | Tipagem estática |
| **Prisma ORM** | Acesso ao banco de dados |
| **PostgreSQL** | Banco de dados relacional |
| **JWT** | Autenticação stateless |
| **Zod** | Validação de schemas |
| **Cloudinary** | Upload e CDN de imagens |
| **Multer** | Middleware de upload |
| **Twilio** | Integração WhatsApp |
| **node-cron** | Tarefas agendadas (lembretes) |
| **Helmet** | Headers de segurança |
| **express-rate-limit** | Proteção contra brute-force |

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **React 18** | UI declarativa |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool ultra-rápido |
| **React Router DOM v6** | Roteamento SPA |
| **Axios** | Cliente HTTP |
| **React Toastify** | Notificações toast |
| **React Icons** | Biblioteca de ícones |
| **CSS3 puro** | Estilização com Custom Properties (sem frameworks) |

---

## 📁 Estrutura do Projeto

```
web-barbearia/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Histórico de migrações
│   │   ├── schema.prisma     # Schema do banco
│   │   └── seed.ts           # Dados iniciais
│   └── src/
│       ├── config/           # Variáveis de ambiente, Cloudinary
│       ├── controllers/      # Handlers HTTP (8)
│       ├── dtos/             # Schemas de validação Zod
│       ├── middlewares/      # Auth, error handler, upload, validate
│       ├── prisma/           # Prisma client singleton
│       ├── repositories/     # Data access layer (8)
│       ├── routes/           # Definição de rotas (8)
│       ├── services/         # Regras de negócio (11)
│       ├── types/            # TypeScript types
│       ├── utils/            # AppError, helpers
│       └── server.ts         # Entry point
│
├── frontend/
│   └── src/
│       ├── components/       # 9 componentes reutilizáveis
│       │   ├── AgendamentoModal/
│       │   ├── Equipe/
│       │   ├── Footer/
│       │   ├── Header/
│       │   ├── Hero/
│       │   ├── Servicos/
│       │   ├── Sobre/
│       │   ├── Unidades/
│       │   └── WhatsAppWidget/
│       ├── contexts/         # AuthContext, SiteConfigContext
│       ├── hooks/            # useColorPalette
│       ├── layouts/          # AdminLayout
│       ├── pages/            # 8 páginas (1 pública + 7 admin)
│       ├── routes/           # AppRoutes, PrivateRoute
│       ├── services/         # API clients (Axios)
│       ├── styles/           # 12 stylesheets CSS
│       ├── App.tsx
│       └── main.tsx
│
├── .gitignore
└── README.md
```

**100 arquivos fonte** (55 backend + 45 frontend) · **8 modelos** de banco · **40 endpoints** · **11 services**

---

## 🗄️ Banco de Dados

### Modelos

| Modelo | Tabela | Descrição |
|--------|--------|-----------|
| `Admin` | `admins` | Usuários administrativos |
| `Servico` | `servicos` | Serviços (nome, preço, duração, imagem) |
| `Agendamento` | `agendamentos` | Agendamentos de clientes |
| `Configuracao` | `configuracoes` | Configurações do sistema (WhatsApp, lembretes) |
| `HorarioBloqueado` | `horarios_bloqueados` | Horários indisponíveis |
| `ConfiguracaoWeb` | `configuracoes_web` | Aparência do site (cores, logos, textos) |
| `MembroEquipe` | `membros_equipe` | Membros da equipe (foto, cargo, redes sociais) |
| `Unidade` | `unidades` | Unidades/filiais (endereço, imagem) |

**Enum:** `StatusAgendamento` → `AGENDADO` | `CANCELADO` | `FINALIZADO`

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** ou **yarn**
- Conta no **Cloudinary** (para upload de imagens)

### 1. Clonar o repositório
```bash
git clone https://github.com/vitorlohan/web-barbearia.git
cd web-barbearia
```

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/barbearia_db?schema=public"

# JWT (use uma chave forte em produção)
JWT_SECRET=sua_chave_secreta_forte

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# WhatsApp / Twilio (opcional)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Rodar migrações e seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

Iniciar o servidor:

```bash
npm run dev
```

> Backend disponível em **http://localhost:3333**

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend disponível em **http://localhost:5173**

---

## 🔐 Acesso ao Painel Admin

Após rodar o seed, use as credenciais padrão:

| Campo | Valor |
|-------|-------|
| **URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@barbearia.com` |
| **Senha** | `admin123` |

> ⚠️ **Altere a senha padrão em produção!**

---

## 📡 Endpoints da API

Base URL: `/api`

### Públicos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/servicos/public` | Serviços ativos |
| `GET` | `/config-web/public` | Configuração do site |
| `GET` | `/equipe/public` | Membros da equipe ativos |
| `GET` | `/unidades/public` | Unidades ativas |
| `GET` | `/configuracao/whatsapp` | Número do WhatsApp |
| `GET` | `/agendamentos/horarios-disponiveis` | Horários disponíveis |
| `POST` | `/agendamentos` | Criar agendamento |

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Login (rate limit: 5 req/15min) |
| `GET` | `/auth/profile` | Perfil do admin (JWT) |

### Admin (requer JWT)

<details>
<summary><strong>Serviços</strong> (7 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/servicos` | Listar todos |
| `GET` | `/servicos/:id` | Buscar por ID |
| `POST` | `/servicos` | Criar |
| `PUT` | `/servicos/:id` | Atualizar |
| `DELETE` | `/servicos/:id` | Deletar |
| `POST` | `/servicos/:id/imagem` | Upload de imagem |
| `DELETE` | `/servicos/:id/imagem` | Remover imagem |

</details>

<details>
<summary><strong>Agendamentos</strong> (6 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/agendamentos` | Listar com filtros |
| `GET` | `/agendamentos/dashboard` | Estatísticas |
| `GET` | `/agendamentos/exportar-csv` | Exportar CSV |
| `GET` | `/agendamentos/:id` | Buscar por ID |
| `PATCH` | `/agendamentos/:id/status` | Atualizar status |
| `PATCH` | `/agendamentos/:id/cancelar` | Cancelar |

</details>

<details>
<summary><strong>Configuração Web</strong> (4 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/config-web` | Buscar configuração |
| `PUT` | `/config-web` | Atualizar configuração |
| `POST` | `/config-web/logo/:tipo` | Upload de logo |
| `POST` | `/config-web/sobre-imagem/:posicao` | Upload de imagem do Sobre |

</details>

<details>
<summary><strong>Equipe</strong> (6 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/equipe` | Listar membros |
| `GET` | `/equipe/:id` | Buscar por ID |
| `POST` | `/equipe` | Criar (com imagem) |
| `PUT` | `/equipe/:id` | Atualizar (com imagem) |
| `DELETE` | `/equipe/:id` | Deletar |
| `PUT` | `/equipe/reorder/batch` | Reordenar |

</details>

<details>
<summary><strong>Unidades</strong> (6 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/unidades` | Listar unidades |
| `GET` | `/unidades/:id` | Buscar por ID |
| `POST` | `/unidades` | Criar (com imagem) |
| `PUT` | `/unidades/:id` | Atualizar (com imagem) |
| `DELETE` | `/unidades/:id` | Deletar |
| `PUT` | `/unidades/reorder/batch` | Reordenar |

</details>

<details>
<summary><strong>Outros</strong> (5 endpoints)</summary>

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/configuracao` | Buscar configurações do sistema |
| `PUT` | `/configuracao` | Atualizar configurações |
| `GET` | `/horarios-bloqueados` | Listar horários bloqueados |
| `POST` | `/horarios-bloqueados` | Bloquear horário |
| `DELETE` | `/horarios-bloqueados/:id` | Desbloquear horário |

</details>

---

## 🎨 Design System

| Token | Valor | Descrição |
|-------|-------|-----------|
| `--color-bg-dark` | `#0D0D0D` | Background principal |
| `--color-bg-card` | `#1A1A1A` | Background dos cards |
| `--color-primary` | `#D4A843` | Dourado (cor primária) |
| `--color-primary-light` | `#E8C76A` | Dourado claro |
| `--color-text-white` | `#F5F5F5` | Texto principal |
| `--color-text-muted` | `#8A8A8A` | Texto secundário |
| `--color-border` | `#2A2A2A` | Bordas |
| Fonte Display | Playfair Display | Títulos |
| Fonte Body | Inter | Corpo de texto |

> Todas as cores são configuráveis pelo painel admin (Config Web → Cores).

---

## 🖼️ Tamanhos de Imagem Recomendados

| Local | Tamanho | Proporção |
|-------|---------|-----------|
| Serviços | 600 × 440 px | 300 × 220 |
| Equipe | 480 × 560 px | 240 × 280 |
| Unidades | 680 × 600 px | 340 × 300 |

---

## 📦 Scripts

### Backend
```bash
npm run dev            # Servidor de desenvolvimento (ts-node-dev)
npm run build          # Compilar TypeScript → dist/
npm run start          # Produção (node dist/server.js)
npm run prisma:generate # Gerar Prisma Client
npm run prisma:migrate  # Rodar migrações
npm run prisma:seed     # Popular banco com dados iniciais
```

### Frontend
```bash
npm run dev            # Servidor de desenvolvimento (Vite)
npm run build          # Build otimizada para produção
npm run preview        # Preview da build local
```

---

## 🔧 Deploy

### Backend
1. Compile: `npm run build`
2. Configure variáveis de ambiente no servidor
3. Rode migrações: `npx prisma migrate deploy`
4. Inicie: `node dist/server.js`

### Frontend
1. Build: `npm run build`
2. Sirva `dist/` com Nginx, Vercel ou Netlify
3. Configure proxy reverso ou `VITE_API_URL` para apontar ao backend

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados a **Vitor Lohan**.

---

<p align="center">
  <strong>Desenvolvido com ☕ por <a href="https://github.com/vitorlohan">Vitor Lohan</a></strong>
</p>
