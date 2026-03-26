#!/bin/bash
# ============================================================
# WiseKM — Setup Inicial do Projeto
# ============================================================

# 1. Criar projeto Next.js com App Router + TypeScript + Tailwind
npx create-next-app@latest wisekm \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd wisekm

# 2. Instalar dependências de produção
npm install \
  next-auth@beta \
  @auth/prisma-adapter \
  @prisma/client \
  bcryptjs \
  zod

# 3. Instalar dependências de desenvolvimento
npm install -D \
  prisma \
  @types/bcryptjs

# 4. Inicializar Prisma com PostgreSQL
npx prisma init --datasource-provider postgresql

# 5. Após configurar o .env com a DATABASE_URL, rodar as migrations:
# npx prisma migrate dev --name init_usuario
# npx prisma generate

echo "✅ Setup concluído! Configure o .env e rode: npx prisma migrate dev --name init_usuario"
