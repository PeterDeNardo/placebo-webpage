# Product Listing Pages - Documentação

## 📋 Visão Geral

Sistema de listagem genérica de produtos com **uma única página reutilizável** para todas as categorias. A página é dinâmica e carrega dados via API ou arquivos locais (fallback).

---

## 🗂️ Estrutura de Rotas

### Página Genérica

**Arquivo único:** `app/categoria/[...slug]/page.tsx`

Esta página usa **catch-all routes** do Next.js para capturar qualquer combinação de segmentos de URL.

### Exemplos de URLs

```
/categoria/novidades
/categoria/marcas/nike
/categoria/marcas/adidas
/categoria/marcas/puma
/categoria/marcas/new-balance
/categoria/roupas/camisetas
/categoria/roupas/calcas
/categoria/roupas/moletons
/categoria/roupas/jaquetas
/categoria/roupas/acessorios
```

### Como Funciona

A URL é convertida em um caminho de arquivo/API:

| URL | Caminho Local | Endpoint API |
|-----|---------------|--------------|
| `/categoria/novidades` | `Data/categories/novidades.json` | `/categories/novidades` |
| `/categoria/marcas/nike` | `Data/categories/marcas/nike.json` | `/categories/marcas/nike` |
| `/categoria/roupas/calcas` | `Data/categories/roupas/calcas.json` | `/categories/roupas/calcas` |

---

## 🧩 Componentes

### `ProductGrid`
Componente reutilizável que renderiza produtos em grid responsivo.

**Props:**
```typescript
{
  products: Product[];  // Array de produtos
  title?: string;       // Título da página (opcional)
}
```

**Layout:**
- Mobile: 1 coluna
- SM: 2 colunas
- MD: 3 colunas
- LG: 4 colunas
- XL: 5 colunas

### `ProductGridSkeleton`
Componente de loading que mostra 10 cards enquanto os dados carregam.

---

## 📦 Estrutura de Dados

### JSON Schema

```json
{
  "title": "Nome da Categoria",
  "products": [
    {
      "id": "produto-1",
      "title": "Nome do Produto",
      "description": "Descrição breve do produto",
      "price": 99.90,
      "image": "https://exemplo.com/imagem.jpg",
      "route": "/product/produto-1"
    }
  ]
}
```

### Localização dos JSONs de Fallback

```
Data/
├── categories/
│   ├── novidades.json
│   ├── marcas/
│   │   ├── nike.json
│   │   ├── adidas.json
│   │   ├── puma.json
│   │   └── new-balance.json
│   └── roupas/
│       ├── camisetas.json
│       ├── calcas.json
│       ├── moletons.json
│       ├── jaquetas.json
│       └── acessorios.json
```

---

## 🌐 API Endpoints

### Configuração

Os endpoints são configurados em `config/app.config.ts`:

```typescript
CATEGORIES_ENDPOINT: '/categories'
```

### Endpoints Esperados

```
GET /categories/novidades
GET /categories/marcas/{brand}
GET /categories/roupas/{category}
```

**Exemplos:**
```
https://api.example.com/categories/novidades
https://api.example.com/categories/marcas/nike
https://api.example.com/categories/roupas/camisetas
```

### Response Schema

```json
{
  "title": "Nike",
  "products": [
    {
      "id": "nike-1",
      "title": "Nike Air Max 90",
      "description": "Tênis clássico com tecnologia Air Max",
      "price": 699.90,
      "image": "https://cdn.example.com/nike-air-max-90.jpg",
      "route": "/product/nike-1"
    }
  ]
}
```

---

## 🔄 Estados da Página

Cada página de listagem gerencia 3 estados:

### 1. Loading
Exibe `ProductGridSkeleton` com 10 cards.

### 2. Error
Mostra `EmptyState` com:
- Mensagem de erro
- Descrição
- Botão "Try Again"

### 3. Success
Renderiza `ProductGrid` com os produtos ou `EmptyState` se não houver produtos.

---

## 🛠️ Como Adicionar Nova Categoria

### 1. Criar JSON de Fallback

```bash
# Exemplo: adicionar categoria "tenis"
Data/categories/tenis.json
```

```json
{
  "title": "Tênis",
  "products": [...]
}
```

### 2. A rota já está criada automaticamente!

Como usamos **catch-all routes** `[...slug]`, não é necessário criar nova página. A URL `/categoria/tenis` funcionará automaticamente.

### 3. Adicionar ao Header (Opcional)

Se quiser que apareça no menu de navegação, edite `Data/headerData.json`:

```json
{
  "title": "Tênis",
  "route": "/categoria/tenis"
}
```

### Exemplo: Adicionar Subcategoria

Para criar `/categoria/roupas/tenis`:

1. Criar `Data/categories/roupas/tenis.json`
2. Adicionar ao submenu em `headerData.json`

A rota funciona automaticamente! ✨

---

## 🎨 Customização

### Alterar Grid Layout

Edite `components/ProductGrid.tsx`:

```tsx
// Linha 27-28
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
```

### Alterar Cards por Página (Skeleton)

Edite `components/ProductGridSkeleton.tsx`:

```tsx
// Linha 9
{Array.from({ length: 10 }).map((_, index) => (
```

### Alterar Altura da Imagem

Edite `components/ProductGrid.tsx`:

```tsx
// Linha 31
<div className="relative w-full h-64 overflow-hidden rounded-t-lg">
```

---

## 🧪 Teste Local

### 1. Verificar modo de desenvolvimento

```bash
npm run dev
```

O app automaticamente usa dados locais em desenvolvimento.

### 2. Acessar páginas

```
http://localhost:3000/categoria/novidades
http://localhost:3000/categoria/marcas/nike
http://localhost:3000/categoria/roupas/camisetas
```

### 3. Forçar uso de API

```bash
NEXT_PUBLIC_USE_LOCAL_DATA=false npm run dev
```

---

## 🚀 Deploy

### Variáveis de Ambiente

Configure no Vercel/Netlify:

```env
NEXT_PUBLIC_USE_LOCAL_DATA=false
NEXT_PUBLIC_API_URL=https://sua-api-producao.com
```

### Backend Requirements

Seu backend deve retornar o JSON schema especificado acima para:
- `/categories/novidades`
- `/categories/marcas/{brand}`
- `/categories/roupas/{category}`

---

## 📊 Features

✅ Grid responsivo (1-5 colunas)  
✅ Skeleton loading  
✅ Estados de erro com retry  
✅ Empty state  
✅ Hover effects nos cards  
✅ Imagens otimizadas com Next.js Image  
✅ Links diretos para páginas de produto  
✅ Fallback local automático em desenvolvimento  
✅ Reutilização total de componentes  

---

## 🔗 Arquivos Relacionados

- **`app/categoria/[...slug]/page.tsx`** - Página genérica única ⭐
- `components/ProductGrid.tsx` - Grid de produtos
- `components/ProductGridSkeleton.tsx` - Loading skeleton
- `components/EmptyState.tsx` - Estado vazio/erro
- `config/app.config.ts` - Configuração de API
- `Data/categories/**/*.json` - Dados de fallback
- `Data/headerData.json` - Rotas de navegação

---

**Última atualização:** Outubro 2025

