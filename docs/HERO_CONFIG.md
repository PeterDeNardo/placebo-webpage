# 🎨 Configuração do Hero

O Hero é totalmente configurável via backend através de um JSON. Ele pode ser ativado/desativado e suporta imagens ou vídeos.

## 📋 Estrutura do JSON

### Endpoint
```
GET /hero
```

### Response Schema

```json
{
  "enabled": boolean,              // true = mostra o Hero, false = oculta
  "mediaType": "image" | "video",  // Tipo de mídia de fundo
  "mediaSrc": string,              // URL da imagem ou vídeo
  "videoFormat": "mp4" | "webm" | "ogg", // Formato do vídeo (apenas se mediaType="video")
  "posterImage": string | null,    // Imagem de preview do vídeo (opcional)
  "overlayOpacity": number,        // Opacidade do overlay escuro (0-100)
  "content": {
    "title": string,               // Título principal
    "subtitle": string,            // Subtítulo/descrição
    "buttons": [                   // Array de botões de CTA
      {
        "text": string,            // Texto do botão
        "href": string,            // Link de destino
        "variant": "primary" | "outline" // Estilo do botão
      }
    ]
  },
  "showScrollIndicator": boolean   // true = mostra seta de scroll animada
}
```

## 📝 Exemplos

### Exemplo 1: Hero com Imagem (Ativo)

```json
{
  "enabled": true,
  "mediaType": "image",
  "mediaSrc": "https://picsum.photos/1920/1080?random=hero",
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

### Exemplo 2: Hero com Vídeo

```json
{
  "enabled": true,
  "mediaType": "video",
  "mediaSrc": "https://example.com/videos/hero-video.mp4",
  "videoFormat": "mp4",
  "posterImage": "https://example.com/images/video-poster.jpg",
  "overlayOpacity": 50,
  "content": {
    "title": "Nova Coleção 2025",
    "subtitle": "Estilo e conforto em cada peça",
    "buttons": [
      {
        "text": "Comprar Agora",
        "href": "/shop",
        "variant": "primary"
      }
    ]
  },
  "showScrollIndicator": true
}
```

### Exemplo 3: Hero Desativado

```json
{
  "enabled": false,
  "mediaType": "image",
  "mediaSrc": "",
  "videoFormat": "mp4",
  "posterImage": null,
  "overlayOpacity": 0,
  "content": {
    "title": "",
    "subtitle": "",
    "buttons": []
  },
  "showScrollIndicator": false
}
```

## 🎬 Tipos de Mídia Suportados

### Imagens
- **Formatos:** JPG, PNG, WebP, GIF, SVG
- **Recomendação:** 1920x1080px ou superior
- **Peso:** Otimizar para < 500KB

### Vídeos
- **Formatos:** MP4 (recomendado), WebM, OGG
- **Recomendação:** 1920x1080px, 30fps
- **Peso:** Otimizar para < 5MB
- **Duração:** 10-30 segundos (loop automático)
- **Áudio:** Sempre mudo (autoplay requirement)

## ⚙️ Propriedades Detalhadas

### `enabled`
- **Tipo:** `boolean`
- **Descrição:** Controla se o Hero aparece na página
- **Valores:** `true` (mostra) | `false` (oculta)

### `mediaType`
- **Tipo:** `string`
- **Descrição:** Define o tipo de mídia de fundo
- **Valores:** `"image"` | `"video"`

### `mediaSrc`
- **Tipo:** `string`
- **Descrição:** URL completa da mídia (imagem ou vídeo)
- **Exemplo:** `"https://cdn.example.com/hero.jpg"`

### `videoFormat`
- **Tipo:** `string`
- **Descrição:** Formato do arquivo de vídeo
- **Valores:** `"mp4"` | `"webm"` | `"ogg"`
- **Nota:** Usado apenas quando `mediaType="video"`

### `posterImage`
- **Tipo:** `string | null`
- **Descrição:** Imagem que aparece antes do vídeo carregar
- **Exemplo:** `"https://cdn.example.com/poster.jpg"`
- **Nota:** Opcional, mas recomendado para vídeos

### `overlayOpacity`
- **Tipo:** `number`
- **Descrição:** Opacidade do overlay escuro sobre a mídia (para melhorar legibilidade do texto)
- **Valores:** `0` (transparente) a `100` (totalmente escuro)
- **Recomendação:** `30-50` para imagens claras, `40-60` para vídeos

### `content.title`
- **Tipo:** `string`
- **Descrição:** Título principal do Hero
- **Tamanho:** Responsivo (6xl → 7xl → 8xl)

### `content.subtitle`
- **Tipo:** `string`
- **Descrição:** Subtítulo/descrição abaixo do título
- **Tamanho:** Responsivo (xl → 2xl)

### `content.buttons`
- **Tipo:** `array`
- **Descrição:** Lista de botões de Call-to-Action
- **Limite:** Recomendado 1-3 botões

#### Button Properties
- **`text`**: Texto exibido no botão
- **`href`**: URL de destino (pode ser relativa ou absoluta)
- **`variant`**: 
  - `"primary"`: Botão branco preenchido
  - `"outline"`: Botão com borda branca transparente

### `showScrollIndicator`
- **Tipo:** `boolean`
- **Descrição:** Mostra/oculta a seta animada de scroll no rodapé do Hero
- **Valores:** `true` (mostra) | `false` (oculta)

## 🔄 Comportamento

### Vídeo
- ✅ **AutoPlay:** Inicia automaticamente
- ✅ **Loop:** Reproduz infinitamente
- ✅ **Muted:** Sem som (requisito para autoplay)
- ✅ **PlaysInline:** Funciona em mobile sem fullscreen
- ✅ **Poster:** Mostra imagem antes de carregar
- ✅ **Fallback:** Se vídeo falhar, mostra posterImage

### Responsividade
- **Desktop:** Hero ocupa 100vh (altura total da tela)
- **Mobile:** Mesma altura, texto e botões adaptam tamanho
- **Tablet:** Layout intermediário

## 🚀 Ambiente

### Desenvolvimento
```bash
npm run dev
```
- Usa dados locais de `Data/heroData.json`
- Não faz chamadas à API

### Produção
```bash
npm run build && npm start
```
- Busca dados de `${API_URL}/hero`
- Fallback para erro se API falhar

### Variáveis de Ambiente

```env
# Forçar uso de dados locais (mesmo em produção)
NEXT_PUBLIC_USE_LOCAL_DATA=true

# URL da API
NEXT_PUBLIC_API_URL=https://api.seusite.com
```

## 📊 Dados Locais (Fallback)

Arquivo: `Data/heroData.json`

Este arquivo é usado automaticamente em desenvolvimento ou quando `NEXT_PUBLIC_USE_LOCAL_DATA=true`.

## 🎯 Casos de Uso

### 1. Campanha Sazonal
```json
{
  "enabled": true,
  "content": {
    "title": "Black Friday 2025",
    "subtitle": "Até 70% de desconto em toda a loja",
    "buttons": [
      {
        "text": "Ver Ofertas",
        "href": "/black-friday",
        "variant": "primary"
      }
    ]
  }
}
```

### 2. Lançamento de Produto
```json
{
  "enabled": true,
  "mediaType": "video",
  "mediaSrc": "/videos/new-collection.mp4",
  "content": {
    "title": "Nova Coleção Verão",
    "subtitle": "Disponível agora",
    "buttons": [
      {
        "text": "Descobrir",
        "href": "/colecao-verao",
        "variant": "primary"
      }
    ]
  }
}
```

### 3. Desativar Hero Temporariamente
```json
{
  "enabled": false
}
```

## 🐛 Troubleshooting

### Hero não aparece
1. Verifique se `enabled: true` no JSON
2. Confirme que a API está retornando dados
3. Verifique o console do navegador para erros

### Vídeo não carrega
1. Confirme que a URL do vídeo está acessível
2. Verifique o formato do vídeo (MP4 recomendado)
3. Adicione um `posterImage` como fallback
4. Teste em diferentes navegadores

### Texto ilegível
1. Aumente o `overlayOpacity` (40-60)
2. Use imagens/vídeos mais escuros
3. Ajuste o contraste da mídia

## 📚 Referências

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [HTML5 Video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Autoplay Policy](https://developer.chrome.com/blog/autoplay/)
