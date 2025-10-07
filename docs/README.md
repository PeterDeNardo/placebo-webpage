# 📚 Documentação - Placebo Webpage

Bem-vindo à documentação completa do projeto Placebo Webpage.

## 📖 Índice

### 🎨 Componentes e Features
- [**HERO_CONFIG.md**](./HERO_CONFIG.md) - Configuração completa do Hero Section
  - Tipos de mídia suportados (imagem/vídeo)
  - Estrutura do JSON
  - Exemplos práticos
  - Troubleshooting

### 📡 Backend e API
- [**API_ENDPOINTS.md**](./API_ENDPOINTS.md) - Documentação dos endpoints
  - `/hero` - Configuração do Hero
  - `/carousels` - Produtos em carrossel
  - Schemas e exemplos
  - Implementação backend

### 🏗️ Arquitetura
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Arquitetura de carregamento
  - Carregamento independente de dados
  - Estados e fluxos
  - Resiliência e performance
  - Como adicionar novos endpoints

### ⚙️ Configuração
- [**CONFIG.md**](./CONFIG.md) - Configuração da aplicação
  - Detecção automática de ambiente
  - Variáveis de ambiente
  - Modo local vs produção

### 🚀 Deploy
- [**DEPLOY.md**](./DEPLOY.md) - Guia de deploy
  - Checklist de produção
  - Testes
  - Troubleshooting

---

## 🏗️ Arquitetura

```
placebo-webpage/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página inicial (Hero + Carousels)
│   ├── layout.tsx           # Layout global
│   └── globals.css          # Estilos globais
│
├── components/              # Componentes React
│   ├── Hero.tsx            # Hero Section (imagem/vídeo)
│   ├── ProductCarousel.tsx # Carrossel de produtos
│   ├── CarouselSkeleton.tsx # Loading skeleton
│   ├── EmptyState.tsx      # Estados vazios/erro
│   ├── SearchOverlay.tsx   # Modal de pesquisa
│   ├── header/
│   │   └── Header.tsx      # Cabeçalho fixo
│   ├── footer/
│   │   └── Footer.tsx      # Rodapé
│   └── ui/                 # Componentes shadcn/ui
│
├── Data/                    # Dados locais (fallback)
│   ├── heroData.json       # Configuração do Hero
│   ├── homeFeedData.json   # Produtos dos carrosséis
│   └── headerData.json     # Navegação do header
│
├── config/                  # Configurações
│   ├── app.config.ts       # Config principal (API, endpoints)
│   └── README.md           # Documentação da config
│
└── docs/                    # Documentação
    ├── README.md           # Este arquivo
    ├── HERO_CONFIG.md      # Config do Hero
    └── API_ENDPOINTS.md    # Endpoints da API
```

---

## 🎯 Features Principais

### 1. Hero Section Dinâmico
- ✅ Suporte a **imagens** e **vídeos**
- ✅ Configurável via **API/JSON**
- ✅ Pode ser **ativado/desativado** remotamente
- ✅ Overlay ajustável
- ✅ Botões de CTA customizáveis
- ✅ Scroll indicator animado

**Documentação:** [HERO_CONFIG.md](./HERO_CONFIG.md)

### 2. Product Carousels
- ✅ Carrosséis dinâmicos baseados em JSON
- ✅ Múltiplos carrosséis por página
- ✅ Cards responsivos
- ✅ Imagens otimizadas (Next.js Image)

### 3. Header & Footer
- ✅ Navegação fixa
- ✅ Logo centralizado
- ✅ Search overlay
- ✅ Links institucionais
- ✅ Redes sociais

### 4. Estados da UI
- ✅ **Loading:** Skeletons animados
- ✅ **Success:** Renderização de conteúdo
- ✅ **Error:** Mensagem + retry button
- ✅ **Empty:** Mensagem quando não há dados

### 5. Ambiente Inteligente
- ✅ **Desenvolvimento:** Usa dados locais (JSON)
- ✅ **Produção:** Busca da API
- ✅ **Detecção automática** de ambiente
- ✅ **Override manual** via env vars

**Documentação:** [CONFIG.md](./CONFIG.md)

---

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (usa dados locais)
npm run dev
```

Acesse: http://localhost:3000

### Testar com API Real

```bash
# Criar .env.local
echo "NEXT_PUBLIC_USE_LOCAL_DATA=false" > .env.local
echo "NEXT_PUBLIC_API_URL=https://api.staging.example.com" >> .env.local

# Rodar
npm run dev
```

### Build de Produção

```bash
# Build
npm run build

# Rodar produção
npm start
```

---

## 📡 Integrando com Backend

### Endpoints Necessários

1. **`GET /hero`** - Configuração do Hero
2. **`GET /carousels`** - Lista de produtos

**Documentação completa:** [API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Exemplo Rápido (Node.js)

```javascript
app.get('/hero', (req, res) => {
  res.json({
    enabled: true,
    mediaType: "image",
    mediaSrc: "https://cdn.example.com/hero.jpg",
    overlayOpacity: 40,
    content: {
      title: "Placebo",
      subtitle: "Descubra o estilo que define você",
      buttons: [
        { text: "Ver Novidades", href: "/novidades", variant: "primary" }
      ]
    },
    showScrollIndicator: true
  });
});

app.get('/carousels', (req, res) => {
  res.json({
    carousels: [
      {
        title: "Featured Products",
        products: [/* ... */]
      }
    ]
  });
});
```

---

## 🎨 Customização

### Alterar Conteúdo do Hero

**Opção 1: Dados Locais (Desenvolvimento)**
Edite: `Data/heroData.json`

**Opção 2: API (Produção)**
Retorne JSON do endpoint `/hero`

**Documentação:** [HERO_CONFIG.md](./HERO_CONFIG.md)

### Adicionar/Remover Carrosséis

**Opção 1: Dados Locais**
Edite: `Data/homeFeedData.json`

**Opção 2: API**
Retorne JSON do endpoint `/carousels`

### Alterar Navegação

Edite: `Data/headerData.json`

```json
{
  "leftNavigation": [
    { "title": "Novidades", "route": "/novidades", "description": "..." }
  ],
  "rightNavigation": [
    { "title": "Carrinho", "route": "/cart", "description": "..." }
  ]
}
```

---

## 🧪 Testes

### Testar Hero com Vídeo

Edite `Data/heroData.json`:

```json
{
  "enabled": true,
  "mediaType": "video",
  "mediaSrc": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "videoFormat": "mp4",
  "posterImage": "https://picsum.photos/1920/1080",
  "overlayOpacity": 50
}
```

### Testar Hero Desativado

```json
{
  "enabled": false
}
```

### Testar Erro de API

```env
NEXT_PUBLIC_USE_LOCAL_DATA=false
NEXT_PUBLIC_API_URL=https://invalid-url.com
```

Deve exibir estado de erro com botão "Try Again".

---

## 🐛 Troubleshooting

### Hero não aparece
1. Verifique `enabled: true` no JSON
2. Confira logs no console do navegador
3. Verifique se a API está retornando dados

### Vídeo não carrega
1. Teste a URL do vídeo diretamente no navegador
2. Verifique o formato (MP4 recomendado)
3. Adicione um `posterImage` como fallback

### Carrosséis vazios
1. Verifique o JSON em `Data/homeFeedData.json`
2. Confira se a API está retornando dados
3. Veja logs no console

### Erro "API failed"
1. Verifique `NEXT_PUBLIC_API_URL`
2. Teste os endpoints manualmente (Postman, curl)
3. Verifique CORS no backend

---

## 📊 Variáveis de Ambiente

### Desenvolvimento (`.env.local`)

```env
# Forçar dados locais (opcional, já é padrão em dev)
NEXT_PUBLIC_USE_LOCAL_DATA=true

# URL da API (para testar integração)
NEXT_PUBLIC_API_URL=https://api.staging.example.com
```

### Produção (Plataforma de Deploy)

```env
# Usar API (padrão em produção)
NEXT_PUBLIC_USE_LOCAL_DATA=false

# URL da API real
NEXT_PUBLIC_API_URL=https://api.placebo.com
```

**Documentação:** [CONFIG.md](./CONFIG.md)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** shadcn/ui
- **Imagens:** Next.js Image Optimization
- **Animações:** Tailwind Animate

---

## 📝 Checklist de Deploy

- [ ] Configurar `NEXT_PUBLIC_API_URL`
- [ ] Implementar endpoints `/hero` e `/carousels`
- [ ] Testar em staging
- [ ] Verificar CORS
- [ ] Otimizar imagens/vídeos
- [ ] Configurar cache headers
- [ ] Monitorar erros (Sentry, etc.)

**Guia completo:** [DEPLOY.md](./DEPLOY.md)

---

## 🤝 Contribuindo

### Adicionar Nova Feature

1. Crie o componente em `components/`
2. Adicione tipos TypeScript
3. Crie JSON de fallback em `Data/`
4. Adicione endpoint em `config/app.config.ts`
5. Documente em `docs/`

### Reportar Bugs

Abra uma issue com:
- Descrição do problema
- Passos para reproduzir
- Logs do console
- Ambiente (dev/prod)

---

## 📚 Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 📄 Licença

Este projeto é proprietário da Placebo.

---

**Última atualização:** Outubro 2025
