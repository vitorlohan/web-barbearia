-- CreateTable
CREATE TABLE "configuracoes_web" (
    "id" TEXT NOT NULL,
    "logo_header_url" TEXT,
    "logo_header_width" INTEGER NOT NULL DEFAULT 150,
    "logo_header_height" INTEGER NOT NULL DEFAULT 50,
    "logo_footer_url" TEXT,
    "logo_footer_width" INTEGER NOT NULL DEFAULT 150,
    "logo_footer_height" INTEGER NOT NULL DEFAULT 50,
    "cor_primaria" TEXT NOT NULL DEFAULT '#D4A843',
    "cor_primaria_light" TEXT NOT NULL DEFAULT '#E8C76A',
    "cor_background" TEXT NOT NULL DEFAULT '#0D0D0D',
    "cor_background_card" TEXT NOT NULL DEFAULT '#1A1A1A',
    "cor_texto" TEXT NOT NULL DEFAULT '#F5F5F5',
    "cor_texto_muted" TEXT NOT NULL DEFAULT '#8A8A8A',
    "cor_borda" TEXT NOT NULL DEFAULT '#2A2A2A',
    "sobre_titulo" TEXT,
    "sobre_texto1" TEXT,
    "sobre_texto2" TEXT,
    "sobre_imagem1" TEXT,
    "sobre_imagem2" TEXT,
    "sobre_imagem3" TEXT,
    "sobre_horario" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "youtube_url" TEXT,
    "twitter_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_equipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT,
    "imagem" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membros_equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "endereco" TEXT,
    "imagem" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);
