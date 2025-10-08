# Sistema de Filtros

## Visão Geral

O sistema de filtros permite aos usuários refinar a visualização de produtos nas páginas de categoria através de um painel lateral fixo à esquerda, sem bordas, com design minimalista.

## Componentes

### FilterPanel

Componente principal do sistema de filtros localizado em `components/FilterPanel.tsx`.

#### Props

```typescript
type FilterPanelProps = {
  products: Product[];                    // Array de produtos a serem filtrados
  filters?: FilterDefinition[];           // Definição dos filtros (do JSON)
  onFilter: (filtered: Product[]) => void; // Callback com produtos filtrados
};

type FilterDefinition = {
  key: string;      // Chave do atributo no produto (ex: "color", "size")
  label: string;    // Label exibido na UI (ex: "Cor", "Tamanho")
  type: "checkbox" | "range"; // Tipo de filtro
};
```

#### Funcionalidades

1. **Filtro de Preço (Sempre Visível)**
   - Slider com range min/max baseado nos preços dos produtos
   - Atualização em tempo real e aplicação automática

2. **Filtros Dinâmicos Baseados no JSON**
   - Utiliza o dicionário `filters` definido no JSON da categoria
   - Extrai automaticamente valores únicos dos produtos
   - Gera checkboxes para cada valor encontrado
   - Keys e values completamente genéricos

3. **Contador de Filtros Ativos**
   - Badge mostrando quantos filtros estão aplicados
   - Atualizado automaticamente ao aplicar/limpar filtros

4. **Design Minimalista**
   - Sem bordas, apenas texto e ícones
   - Posicionado fixo à esquerda
   - Botão para expandir/colapsar
   - Filtros aplicados automaticamente ao selecionar

## Estrutura de Dados dos Produtos

### Campos Obrigatórios

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": number,
  "image": "string",
  "route": "string"
}
```

### Definição de Filtros no JSON

A categoria deve definir quais atributos serão filtráveis através do array `filters`:

```json
{
  "title": "Camisetas",
  "filters": [
    {
      "key": "color",
      "label": "Cor",
      "type": "checkbox"
    },
    {
      "key": "size",
      "label": "Tamanho",
      "type": "checkbox"
    },
    {
      "key": "style",
      "label": "Estilo",
      "type": "checkbox"
    }
  ],
  "products": [...]
}
```

### Campos Filtráveis (Dinâmicos)

Os produtos devem conter as propriedades correspondentes às keys definidas em `filters`:

```json
{
  // ... campos obrigatórios
  "color": "Preto",
  "size": "M",
  "brand": "Nike",
  "category": "Camisetas",
  "gender": "Masculino",
  "style": "Oversized"
}
```

## Exemplos de Uso

### Exemplo 1: Camisetas

```json
{
  "title": "Camisetas",
  "filters": [
    {
      "key": "color",
      "label": "Cor",
      "type": "checkbox"
    },
    {
      "key": "size",
      "label": "Tamanho",
      "type": "checkbox"
    },
    {
      "key": "style",
      "label": "Estilo",
      "type": "checkbox"
    }
  ],
  "products": [
    {
      "id": "cam-1",
      "title": "Camiseta Oversized Preta",
      "description": "Camiseta confortável",
      "price": 89.90,
      "image": "https://...",
      "route": "/product/cam-1",
      "color": "Preto",
      "size": "G",
      "style": "Oversized"
    },
    {
      "id": "cam-2",
      "title": "Camiseta Básica Branca",
      "description": "Camiseta básica",
      "price": 79.90,
      "image": "https://...",
      "route": "/product/cam-2",
      "color": "Branco",
      "size": "M",
      "style": "Básica"
    }
  ]
}
```

**Filtros Exibidos:**
- **Preço:** Slider R$ 79,90 - R$ 89,90
- **Cor:** ☐ Branco ☐ Preto
- **Tamanho:** ☐ G ☐ M
- **Estilo:** ☐ Básica ☐ Oversized

### Exemplo 2: Marca Nike

```json
{
  "title": "Nike",
  "hero": {...},
  "filters": [
    {
      "key": "category",
      "label": "Categoria",
      "type": "checkbox"
    },
    {
      "key": "color",
      "label": "Cor",
      "type": "checkbox"
    },
    {
      "key": "gender",
      "label": "Gênero",
      "type": "checkbox"
    }
  ],
  "products": [
    {
      "id": "nike-1",
      "title": "Nike Air Max 90",
      "description": "Tênis clássico",
      "price": 699.90,
      "image": "https://...",
      "route": "/product/nike-1",
      "category": "Calçados",
      "color": "Branco",
      "gender": "Unissex"
    }
  ]
}
```

**Filtros Exibidos:**
- **Preço:** Slider
- **Categoria:** ☐ Calçados
- **Cor:** ☐ Branco
- **Gênero:** ☐ Unissex

## Integração na Página de Categoria

O componente `FilterPanel` está integrado em `app/categoria/[...slug]/page.tsx`:

```tsx
const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

const handleFilter = (filtered: Product[]) => {
  setFilteredProducts(filtered);
};

<div className="flex gap-8">
  {/* Filtro à esquerda - sticky para acompanhar scroll */}
  <FilterPanel 
    products={data.products} 
    filters={data.filters}
    onFilter={handleFilter} 
  />
  
  {/* Grid de produtos à direita */}
  <div className="flex-1 min-w-0">
    <ProductGrid 
      products={filteredProducts} 
      showEmpty={filteredProducts.length === 0} 
    />
  </div>
</div>
```

## Comportamento

1. **Ao Carregar a Página:**
   - Lê o dicionário `filters` do JSON
   - Para cada filtro definido, extrai valores únicos dos produtos
   - Exibe apenas filtros que têm valores

2. **Ao Selecionar um Filtro:**
   - **Aplicação Automática:** Filtro é aplicado imediatamente
   - Filtra por range de preço (slider)
   - Filtra por atributos selecionados (checkboxes)
   - Atualiza contador de filtros ativos
   - Atualiza a grid de produtos em tempo real

3. **Ao Limpar Filtros:**
   - Botão "Limpar Filtros" aparece quando há filtros ativos
   - Reseta todos os filtros
   - Mostra todos os produtos
   - Remove o badge de contador

4. **Estado Vazio:**
   - Quando nenhum produto corresponde aos filtros
   - Exibe mensagem "Nenhum produto encontrado"
   - Sugere ajustar os filtros

5. **Expandir/Colapsar:**
   - Botão com ícone de filtro permite ocultar/mostrar os filtros
   - Estado persiste durante a navegação na página

## Estilização

Design minimalista sem bordas:
- **Posição:** Fixo à esquerda (w-64, flex-shrink-0)
- **Layout:** Texto e ícones apenas
- **Botão Toggle:** Ícone de funil + texto "Filtros"
- **Badge:** Contador de filtros ativos
- **Spacing:** gap-8 entre filtro e grid de produtos

## UI Components Utilizados

- `Badge` (contador de filtros)
- `Checkbox` (seleção de atributos)
- `Slider` (range de preço)
- `Button` (limpar filtros)
- `Label` (títulos dos filtros)

## Customização

### Adicionar Novos Campos Filtráveis

**Passo 1:** Adicione o filtro ao dicionário `filters` no JSON da categoria:

```json
{
  "title": "Camisetas",
  "filters": [
    {
      "key": "material",
      "label": "Material",
      "type": "checkbox"
    },
    {
      "key": "season",
      "label": "Estação",
      "type": "checkbox"
    }
  ],
  "products": [...]
}
```

**Passo 2:** Adicione as propriedades correspondentes nos produtos:

```json
{
  "id": "prod-1",
  // ... outros campos
  "material": "Algodão",
  "season": "Verão"
}
```

Os filtros aparecerão automaticamente na interface!

## Performance

- **Extração de Atributos:** O(n × m) onde n = produtos, m = atributos
- **Filtragem:** O(n × f) onde n = produtos, f = filtros ativos
- **Otimizado para:** Até 1000 produtos por categoria

## Compatibilidade

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Touch gestures
- ✅ Keyboard navigation

## Backend Integration

O backend deve retornar produtos com o dicionário de filtros:

```typescript
GET /api/categories/{slug}

Response:
{
  "title": "Nome da Categoria",
  "hero": { ... },
  "filters": [
    {
      "key": "color",
      "label": "Cor",
      "type": "checkbox"
    },
    {
      "key": "size",
      "label": "Tamanho",
      "type": "checkbox"
    }
  ],
  "products": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "price": 99.90,
      "image": "...",
      "route": "...",
      // Atributos filtráveis (devem corresponder às keys em filters)
      "color": "Preto",
      "size": "M"
    }
  ]
}
```

## Próximas Melhorias

- [ ] Persistência de filtros na URL (query params)
- [ ] Histórico de filtros aplicados
- [ ] Filtros salvos (favoritos)
- [ ] Ordenação de produtos
- [ ] Filtros de range para outros campos numéricos
- [ ] Sugestões de filtros populares

