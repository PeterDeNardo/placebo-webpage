# 📡 API Endpoints

Documentação dos endpoints necessários para o backend da aplicação.

## 🏠 Base URL

```
Production: https://api.example.com
Development: Local fallback (JSON files)
```

Configure via variável de ambiente:
```env
NEXT_PUBLIC_API_URL=https://api.seusite.com
```

---

## 🎨 Hero Section

### `GET /hero`

Retorna a configuração do Hero da página inicial.

#### Response Schema

```typescript
{
  enabled: boolean;
  mediaType: "image" | "video";
  mediaSrc: string;
  videoFormat: "mp4" | "webm" | "ogg";
  posterImage: string | null;
  overlayOpacity: number; // 0-100
  content: {
    title: string;
    subtitle: string;
    buttons: Array<{
      text: string;
      href: string;
      variant: "primary" | "outline";
    }>;
  };
  showScrollIndicator: boolean;
}
```

#### Example Response

```json
{
  "enabled": true,
  "mediaType": "image",
  "mediaSrc": "https://cdn.example.com/hero.jpg",
  "videoFormat": "mp4",
  "posterImage": null,
  "overlayOpacity": 40,
  "content": {
    "title": "Placebo",
    "subtitle": "Descubra o estilo que define você",
    "buttons": [
      {
        "text": "Ver Novidades",
        "href": "/novidades",
        "variant": "primary"
      },
      {
        "text": "Explorar Coleção",
        "href": "/roupas",
        "variant": "outline"
      }
    ]
  },
  "showScrollIndicator": true
}
```

#### Local Fallback
`Data/heroData.json`

---

## 🎠 Product Carousels

### `GET /carousels`

Retorna os carrosséis de produtos da página inicial.

#### Response Schema

```typescript
{
  carousels: Array<{
    title: string;
    products: Array<{
      id: number;
      title: string;
      description: string;
      value: number;
      image: string;
      route: string;
    }>;
  }>;
}
```

#### Example Response

```json
{
  "carousels": [
    {
      "title": "Featured Products",
      "products": [
        {
          "id": 1,
          "title": "Premium Wireless Headphones",
          "description": "High-quality noise-cancelling headphones",
          "value": 299.99,
          "image": "https://cdn.example.com/product1.jpg",
          "route": "/products/wireless-headphones"
        }
      ]
    },
    {
      "title": "New Arrivals",
      "products": [
        {
          "id": 5,
          "title": "4K Action Camera",
          "description": "Waterproof action camera",
          "value": 349.99,
          "image": "https://cdn.example.com/product5.jpg",
          "route": "/products/action-camera"
        }
      ]
    }
  ]
}
```

#### Local Fallback
`Data/homeFeedData.json`

---

## 🔧 Configuração

### Ambiente de Desenvolvimento

```bash
npm run dev
```

**Comportamento:**
- ✅ Usa dados locais (JSON files)
- ❌ Não faz chamadas à API
- 🔍 `appConfig.USE_LOCAL_DATA = true`

### Ambiente de Produção

```bash
npm run build
npm start
```

**Comportamento:**
- ❌ Não usa dados locais
- ✅ Faz chamadas à API
- 🔍 `appConfig.USE_LOCAL_DATA = false`
- ⚠️ Mostra erro se API falhar (não usa fallback)

### Forçar Modo Local em Produção

```env
NEXT_PUBLIC_USE_LOCAL_DATA=true
```

---

## 📊 Estados da UI

### Loading
- Exibe skeletons enquanto busca dados
- Componente: `CarouselSkeleton`

### Success
- Renderiza Hero (se `enabled: true`)
- Renderiza carrosséis de produtos

### Error
- Exibe mensagem de erro
- Botão "Try Again" para retry
- Componente: `EmptyState` (type="error")

### Empty
- Exibe quando não há produtos
- Componente: `EmptyState` (type="empty")

---

## 🚀 Implementação no Backend

### Requisitos Mínimos

1. **CORS habilitado** para o domínio do frontend
2. **HTTPS** em produção
3. **Cache headers** recomendados:
   ```
   Cache-Control: public, max-age=300, s-maxage=600
   ```

### Exemplo Node.js/Express

```javascript
// GET /hero
app.get('/hero', (req, res) => {
  res.json({
    enabled: true,
    mediaType: "image",
    mediaSrc: "https://cdn.example.com/hero.jpg",
    videoFormat: "mp4",
    posterImage: null,
    overlayOpacity: 40,
    content: {
      title: "Placebo",
      subtitle: "Descubra o estilo que define você",
      buttons: [
        {
          text: "Ver Novidades",
          href: "/novidades",
          variant: "primary"
        }
      ]
    },
    showScrollIndicator: true
  });
});

// GET /carousels
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

### Exemplo Python/FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class HeroData(BaseModel):
    enabled: bool
    mediaType: str
    mediaSrc: str
    # ... outros campos

@app.get("/hero")
async def get_hero() -> HeroData:
    return HeroData(
        enabled=True,
        mediaType="image",
        mediaSrc="https://cdn.example.com/hero.jpg",
        # ... outros campos
    )

@app.get("/carousels")
async def get_carousels():
    return {
        "carousels": [
            {
                "title": "Featured Products",
                "products": [...]
            }
        ]
    }
```

---

## 🧪 Testes

### Testar Localmente

```bash
npm run dev
```
Acesse: http://localhost:3000

### Testar com API Real

```bash
# .env.local
NEXT_PUBLIC_USE_LOCAL_DATA=false
NEXT_PUBLIC_API_URL=https://api.staging.example.com
```

```bash
npm run dev
```

### Simular Erro de API

1. Configure URL inválida:
   ```env
   NEXT_PUBLIC_API_URL=https://invalid-url.com
   ```
2. Deve exibir `EmptyState` com erro

---

## 📝 Checklist de Deploy

- [ ] Configurar `NEXT_PUBLIC_API_URL` na plataforma de deploy
- [ ] Verificar que endpoints `/hero` e `/carousels` estão funcionando
- [ ] Testar em produção com `NEXT_PUBLIC_USE_LOCAL_DATA=false`
- [ ] Configurar CORS no backend
- [ ] Adicionar cache headers
- [ ] Monitorar erros de API (Sentry, etc.)
- [ ] Testar fallback de erro

---

## 🔍 Debug

### Logs no Console

O app exibe logs úteis no console do navegador:

```
🔍 Ambiente: {
  NODE_ENV: "production",
  isDevelopment: false,
  useLocalData: false
}

🌐 Modo produção: buscando dados da API

✅ Dados carregados da API com sucesso
```

### Verificar Configuração

```javascript
import { appConfig } from "@/config/app.config";

console.log(appConfig);
// {
//   USE_LOCAL_DATA: false,
//   API_URL: "https://api.example.com",
//   CAROUSELS_ENDPOINT: "/carousels",
//   HERO_ENDPOINT: "/hero",
//   NODE_ENV: "production",
//   IS_DEVELOPMENT: false
// }
```

---

## 📚 Documentação Relacionada

- [HERO_CONFIG.md](./HERO_CONFIG.md) - Configuração detalhada do Hero
- [CONFIG.md](./CONFIG.md) - Configuração da aplicação
- [DEPLOY.md](./DEPLOY.md) - Instruções de deploy
