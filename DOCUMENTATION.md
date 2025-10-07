# 📚 Documentação Completa - Placebo Webpage

Todos os documentos estão organizados na pasta [`docs/`](./docs/).

## 📖 Índice Rápido

### 🎯 Começando
- [**README.md**](./README.md) - Visão geral do projeto e quick start

### 📘 Documentação Principal
- [**docs/README.md**](./docs/README.md) - Hub completo de documentação
- [**docs/HERO_CONFIG.md**](./docs/HERO_CONFIG.md) - Configuração do Hero Section
- [**docs/API_ENDPOINTS.md**](./docs/API_ENDPOINTS.md) - Documentação da API
- [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - Arquitetura de carregamento
- [**docs/CONFIG.md**](./docs/CONFIG.md) - Guia de configuração
- [**docs/DEPLOY.md**](./docs/DEPLOY.md) - Guia de deployment
- [**docs/CHANGELOG.md**](./docs/CHANGELOG.md) - Histórico de mudanças

---

## 🎨 Hero Section

O Hero é totalmente configurável via backend:

```json
{
  "enabled": true,
  "mediaType": "image",
  "mediaSrc": "https://cdn.example.com/hero.jpg",
  "content": {
    "title": "Placebo",
    "subtitle": "Descubra o estilo que define você",
    "buttons": [...]
  }
}
```

**Leia mais:** [docs/HERO_CONFIG.md](./docs/HERO_CONFIG.md)

---

## 📡 API Endpoints

### `GET /hero`
Configuração do Hero (ativar/desativar, imagem/vídeo, conteúdo)

### `GET /carousels`
Lista de produtos em carrosséis

**Leia mais:** [docs/API_ENDPOINTS.md](./docs/API_ENDPOINTS.md)

---

## ⚙️ Configuração

### Desenvolvimento
```bash
npm run dev
```
Usa dados locais automaticamente.

### Produção
```bash
npm run build && npm start
```
Busca dados da API configurada.

**Leia mais:** [docs/CONFIG.md](./docs/CONFIG.md)

---

## 🚀 Deploy

### Checklist Rápido
- [ ] Configurar `NEXT_PUBLIC_API_URL`
- [ ] Implementar endpoints `/hero` e `/carousels`
- [ ] Testar em staging
- [ ] Deploy para produção

**Leia mais:** [docs/DEPLOY.md](./docs/DEPLOY.md)

---

## 🗂️ Estrutura de Arquivos

```
placebo-webpage/
├── README.md              # Visão geral do projeto
├── DOCUMENTATION.md       # Este arquivo (índice de docs)
│
├── app/                   # Next.js App Router
├── components/            # Componentes React
├── config/                # Configurações
├── Data/                  # Dados locais (fallback)
│
└── docs/                  # 📚 Toda a documentação
    ├── README.md          # Hub de documentação
    ├── HERO_CONFIG.md     # Configuração do Hero
    ├── API_ENDPOINTS.md   # Documentação da API
    ├── ARCHITECTURE.md    # Arquitetura de carregamento
    ├── CONFIG.md          # Guia de configuração
    ├── DEPLOY.md          # Guia de deployment
    └── CHANGELOG.md       # Histórico de versões
```

---

## 🔗 Links Úteis

| Documento | Descrição |
|-----------|-----------|
| [README.md](./README.md) | Visão geral e quick start |
| [docs/README.md](./docs/README.md) | Hub completo de documentação |
| [docs/HERO_CONFIG.md](./docs/HERO_CONFIG.md) | Como configurar o Hero Section |
| [docs/API_ENDPOINTS.md](./docs/API_ENDPOINTS.md) | Endpoints e schemas da API |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitetura de carregamento independente |
| [docs/CONFIG.md](./docs/CONFIG.md) | Variáveis de ambiente e config |
| [docs/DEPLOY.md](./docs/DEPLOY.md) | Como fazer deploy |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | Histórico de mudanças |

---

## 🤔 Precisa de Ajuda?

### Para Desenvolvedores Frontend
1. Comece com [README.md](./README.md)
2. Veja [docs/CONFIG.md](./docs/CONFIG.md) para setup local
3. Explore [docs/README.md](./docs/README.md) para features

### Para Desenvolvedores Backend
1. Leia [docs/API_ENDPOINTS.md](./docs/API_ENDPOINTS.md)
2. Implemente os endpoints `/hero` e `/carousels`
3. Veja exemplos de response nos docs

### Para DevOps/Deploy
1. Siga [docs/DEPLOY.md](./docs/DEPLOY.md)
2. Configure variáveis de ambiente em [docs/CONFIG.md](./docs/CONFIG.md)
3. Use o checklist de deploy

### Para Designers/Product
1. Entenda o Hero em [docs/HERO_CONFIG.md](./docs/HERO_CONFIG.md)
2. Veja como customizar conteúdo via JSON
3. Teste diferentes configurações localmente

---

**Última atualização:** Outubro 2025
