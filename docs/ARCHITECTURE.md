# 🏗️ Arquitetura de Carregamento de Dados

Este documento explica como funciona o sistema de carregamento independente de dados na aplicação.

## 🎯 Problema Resolvido

**Antes:** Hero e Carrosséis eram carregados juntos em uma única função. Se um falhasse, ambos falhavam.

**Agora:** Hero e Carrosséis são carregados de forma **independente**. Se um falhar, o outro continua funcionando normalmente.

---

## 📊 Fluxo de Carregamento

```
┌─────────────────────────────────────────────────────────┐
│                    useEffect()                          │
│  (Executado quando o componente monta)                  │
└─────────────┬───────────────────────────────────────────┘
              │
              ├─────────────────┬─────────────────────────┐
              │                 │                         │
              ▼                 ▼                         │
    ┌─────────────────┐  ┌─────────────────┐            │
    │  fetchHero()    │  │ fetchCarousels()│            │
    │  (Independente) │  │  (Independente) │            │
    └────────┬────────┘  └────────┬────────┘            │
             │                     │                      │
             │                     │                      │
    ┌────────▼────────┐   ┌───────▼────────┐            │
    │ Hero Loading    │   │ Carousels      │            │
    │ ✅ Success      │   │ Loading        │            │
    │ ❌ Fail Silent  │   │ ✅ Success     │            │
    │                 │   │ ❌ Show Error  │            │
    └─────────────────┘   └────────────────┘            │
             │                     │                      │
             │                     │                      │
             ▼                     ▼                      │
    ┌─────────────────────────────────────────────────┐  │
    │          Página Renderizada                     │  │
    │  - Hero (se enabled=true e carregou)            │  │
    │  - Carrosséis (sempre, com estados)             │  │
    └─────────────────────────────────────────────────┘  │
                                                          │
                      Ambos executam em PARALELO ────────┘
```

---

## 🔄 Estados Independentes

### Hero

| Estado | Descrição | UI |
|--------|-----------|-----|
| **Loading** | `heroLoading = true` | Mostra `<HeroSkeleton />` |
| **Success** | `heroData != null && enabled = true` | Mostra `<Hero />` |
| **Disabled** | `heroData.enabled = false` | Não mostra nada |
| **Error** | Fetch falhou | Não mostra nada (falha silenciosa) |

### Carrosséis

| Estado | Descrição | UI |
|--------|-----------|-----|
| **Loading** | `carouselsLoading = true` | Mostra `<CarouselSkeleton />` (2x) |
| **Success** | `carousels.length > 0` | Mostra carrosséis |
| **Error** | `carouselsError = true` | Mostra `<EmptyState type="error">` com retry |
| **Empty** | `carousels.length = 0` | Mostra `<EmptyState type="empty">` |

---

## 📝 Implementação

### Estado do Componente

```typescript
const [carousels, setCarousels] = useState<Carousel[]>([]);
const [heroData, setHeroData] = useState<HeroData | null>(null);
const [carouselsLoading, setCarouselsLoading] = useState(true);
const [heroLoading, setHeroLoading] = useState(true);
const [carouselsError, setCarouselsError] = useState(false);
```

**Nota:** Hero não tem estado de erro porque falha silenciosamente.

### Função fetchHero()

```typescript
const fetchHero = async () => {
  try {
    setHeroLoading(true);
    
    if (appConfig.USE_LOCAL_DATA) {
      // Usa dados locais
      setHeroData(heroDataFallback as HeroData);
      return;
    }
    
    // Busca da API
    const response = await fetch(`${API_URL}/hero`);
    if (!response.ok) throw new Error('Hero fetch failed');
    
    const data = await response.json();
    setHeroData(data);
    console.log('✅ Hero: Dados carregados');
  } catch (err) {
    console.error('❌ Hero: Erro ao buscar dados:', err);
    setHeroData(null); // Falha silenciosa
  } finally {
    setHeroLoading(false);
  }
};
```

### Função fetchCarousels()

```typescript
const fetchCarousels = async () => {
  try {
    setCarouselsLoading(true);
    setCarouselsError(false);
    
    if (appConfig.USE_LOCAL_DATA) {
      // Usa dados locais
      setCarousels(homeFeedDataFallback.carousels);
      return;
    }
    
    // Busca da API
    const response = await fetch(`${API_URL}/carousels`);
    if (!response.ok) throw new Error('Carousels fetch failed');
    
    const data = await response.json();
    setCarousels(data.carousels);
    console.log('✅ Carrosséis: Dados carregados');
  } catch (err) {
    console.error('❌ Carrosséis: Erro ao buscar dados:', err);
    setCarouselsError(true); // Mostra erro na UI
    setCarousels([]);
  } finally {
    setCarouselsLoading(false);
  }
};
```

### useEffect

```typescript
useEffect(() => {
  console.log('🔍 Ambiente:', appConfig);
  
  // Executa ambas em paralelo, mas independentes
  fetchHero();
  fetchCarousels();
}, []);
```

---

## 🎯 Cenários de Uso

### Cenário 1: Tudo OK
```
Hero API: ✅ Success
Carousels API: ✅ Success

Resultado:
✅ Hero exibido
✅ Carrosséis exibidos
```

### Cenário 2: Hero Falha
```
Hero API: ❌ Error (500)
Carousels API: ✅ Success

Resultado:
❌ Hero não exibido (silencioso)
✅ Carrosséis exibidos normalmente
```

### Cenário 3: Carrosséis Falham
```
Hero API: ✅ Success
Carousels API: ❌ Error (500)

Resultado:
✅ Hero exibido
❌ Carrosséis mostram erro com botão "Try Again"
```

### Cenário 4: Ambos Falham
```
Hero API: ❌ Error
Carousels API: ❌ Error

Resultado:
❌ Hero não exibido
❌ Carrosséis mostram erro com botão "Try Again"
```

### Cenário 5: Hero Desabilitado
```
Hero API: ✅ Success (enabled: false)
Carousels API: ✅ Success

Resultado:
❌ Hero não exibido (desabilitado pelo backend)
✅ Carrosséis exibidos
```

---

## 🔍 Logs do Console

### Desenvolvimento (Dados Locais)
```
🔍 Ambiente: {
  NODE_ENV: "development",
  isDevelopment: true,
  useLocalData: true
}
🎨 Hero: Usando dados locais
🎠 Carrosséis: Usando dados locais
```

### Produção (API)
```
🔍 Ambiente: {
  NODE_ENV: "production",
  isDevelopment: false,
  useLocalData: false
}
🌐 Hero: Buscando da API: https://api.example.com/hero
🌐 Carrosséis: Buscando da API: https://api.example.com/carousels
✅ Hero: Dados carregados com sucesso
✅ Carrosséis: Dados carregados com sucesso
```

### Produção com Erro
```
🔍 Ambiente: { ... }
🌐 Hero: Buscando da API: https://api.example.com/hero
🌐 Carrosséis: Buscando da API: https://api.example.com/carousels
❌ Hero: Erro ao buscar dados: Error: HTTP 500
✅ Carrosséis: Dados carregados com sucesso
```

---

## 🎨 Componentes de UI

### HeroSkeleton
Exibido durante o carregamento do Hero.

```tsx
<HeroSkeleton />
```

**Visual:**
- Background cinza animado
- Skeleton do título
- Skeleton do subtítulo
- Skeleton dos botões
- Skeleton do scroll indicator

### CarouselSkeleton
Exibido durante o carregamento dos carrosséis.

```tsx
<CarouselSkeleton />
<CarouselSkeleton />
```

**Visual:**
- Skeleton do título do carrossel
- 4 cards com skeleton (imagem, título, descrição, preço)

### EmptyState
Exibido quando há erro ou dados vazios.

```tsx
// Erro
<EmptyState 
  type="error"
  message="Unable to load products"
  description="Error message..."
  onRetry={fetchCarousels}
/>

// Vazio
<EmptyState 
  type="empty"
  message="No products available"
  description="No products message..."
/>
```

---

## 🚀 Benefícios

### ✅ Resiliência
- Se Hero falhar, carrosséis continuam funcionando
- Se Carrosséis falharem, Hero continua funcionando
- Usuário sempre vê algum conteúdo

### ✅ Performance
- Requisições em paralelo (não sequenciais)
- Cada componente carrega independentemente
- Skeleton específico para cada seção

### ✅ UX Melhorada
- Feedback visual claro (skeletons)
- Erro específico para carrosséis (com retry)
- Hero falha silenciosamente (não atrapalha a experiência)

### ✅ Manutenibilidade
- Funções separadas e focadas
- Fácil adicionar novos endpoints
- Logs claros e específicos

---

## 🔧 Adicionando Novos Endpoints

Para adicionar um novo endpoint independente:

1. **Criar estado:**
```typescript
const [newData, setNewData] = useState(null);
const [newDataLoading, setNewDataLoading] = useState(true);
const [newDataError, setNewDataError] = useState(false);
```

2. **Criar função de fetch:**
```typescript
const fetchNewData = async () => {
  try {
    setNewDataLoading(true);
    setNewDataError(false);
    
    if (appConfig.USE_LOCAL_DATA) {
      setNewData(localFallback);
      return;
    }
    
    const response = await fetch(`${API_URL}/new-endpoint`);
    if (!response.ok) throw new Error('Fetch failed');
    
    const data = await response.json();
    setNewData(data);
  } catch (err) {
    console.error('❌ Error:', err);
    setNewDataError(true);
  } finally {
    setNewDataLoading(false);
  }
};
```

3. **Adicionar ao useEffect:**
```typescript
useEffect(() => {
  fetchHero();
  fetchCarousels();
  fetchNewData(); // ← Novo
}, []);
```

4. **Renderizar com estados:**
```tsx
{newDataLoading ? (
  <Skeleton />
) : newDataError ? (
  <EmptyState type="error" onRetry={fetchNewData} />
) : (
  <NewComponent data={newData} />
)}
```

---

## 📚 Referências

- [app/page.tsx](../app/page.tsx) - Implementação completa
- [components/HeroSkeleton.tsx](../components/HeroSkeleton.tsx) - Skeleton do Hero
- [components/CarouselSkeleton.tsx](../components/CarouselSkeleton.tsx) - Skeleton dos carrosséis
- [components/EmptyState.tsx](../components/EmptyState.tsx) - Estados de erro/vazio
- [CONFIG.md](./CONFIG.md) - Configuração de ambiente
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Documentação da API

---

**Última atualização:** Outubro 2025
