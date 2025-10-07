# Configuração da Aplicação

## ✨ Detecção Automática de Ambiente

O sistema **detecta automaticamente** o ambiente e ajusta o comportamento:

### 🔧 Desenvolvimento Local (`npm run dev`)
**Automático:** Usa dados locais do arquivo `Data/homeFeedData.json`

- ✅ Detectado automaticamente via `NODE_ENV === 'development'`
- 🚫 **Não faz requisições HTTP**
- ⚡ Carrega dados instantaneamente
- 🎯 Ideal para desenvolvimento e testes
- 💡 Você **NÃO precisa configurar nada!**

### 🌐 Produção (`npm run build` → `npm start`)
**Automático:** Busca dados da API

- ✅ Detectado automaticamente via `NODE_ENV === 'production'`
- 🌐 Faz fetch da API configurada
- 🛡️ Fallback para dados locais se a API falhar
- 🚀 Pronto para produção

## 🎛️ Configuração Manual (Opcional)

Se você precisar **forçar** um modo específico, use variáveis de ambiente:

### Opção 1: Arquivo `.env.local` (recomendado)
```env
# Forçar modo específico (sobrescreve detecção automática)
NEXT_PUBLIC_USE_LOCAL_DATA=true   # ou false

# URL da API em produção
NEXT_PUBLIC_API_URL=https://sua-api-real.com
```

### Opção 2: Variáveis de ambiente na plataforma de deploy
No Vercel, Netlify, etc., configure:
- `NEXT_PUBLIC_API_URL` → URL da sua API real
- `NEXT_PUBLIC_USE_LOCAL_DATA` → deixe vazio (usa automático)

### 🛡️ Tratamento de Erros

**Em Desenvolvimento:**
- ✅ Sempre usa dados locais
- ✅ Sem possibilidade de erro

**Em Produção:**
Se a API falhar ou estiver indisponível:
1. ❌ Detecta o erro
2. 🚨 Mostra tela de erro com ícone de alerta
3. 🔄 Oferece botão "Try Again" para tentar novamente
4. 🚫 **NÃO usa fallback automático**

**Motivo:** Em produção, é melhor mostrar um erro claro do que dados desatualizados.

### 📋 Formato da API
A API deve retornar JSON neste formato:
```json
{
  "carousels": [
    {
      "title": "Featured Products",
      "products": [
        {
          "id": 1,
          "title": "Nome do Produto",
          "description": "Descrição",
          "value": 99.99,
          "image": "https://...",
          "route": "/products/..."
        }
      ]
    }
  ]
}
```

### 🔍 Como verificar qual modo está ativo
Abra o Console do navegador (F12) e procure por:
- `🔧 Usando dados locais` → Modo desenvolvimento
- `🌐 Modo produção: buscando dados da API` → Fazendo chamada à API
- `✅ Dados carregados da API com sucesso: 2 carrosséis` → API funcionou
- `❌ Erro ao buscar dados da API: [erro]` → API falhou, mostrando tela de erro

### 🎨 Estados Visuais

A aplicação tem 4 estados visuais diferentes:

1. **Loading** 
   - Skeleton animado mostrando 2 carrosséis
   - Aparece durante o carregamento inicial

2. **Erro** 
   - Ícone de alerta vermelho
   - Mensagem: "Unable to load products"
   - Botão "Try Again" para retry
   - Ocorre quando a API falha

3. **Vazio** 
   - Ícone de caixa cinza
   - Mensagem: "No products available"
   - Ocorre quando API retorna array vazio

4. **Sucesso** 
   - Carrosséis com produtos
   - Navegação com setas
   - Cards clicáveis

