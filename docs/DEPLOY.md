# 🚀 Guia de Deploy

## Resumo: A flag é AUTOMÁTICA! ✨

**Você NÃO precisa configurar nada manualmente!** O sistema detecta automaticamente o ambiente.

## 🔄 Como funciona

| Ambiente | Comando | Comportamento | Automático? |
|----------|---------|---------------|-------------|
| **Desenvolvimento** | `npm run dev` | Usa dados locais | ✅ SIM |
| **Produção** | `npm run build` + `npm start` | Usa API | ✅ SIM |

## 📋 Checklist para Deploy

### Opção 1: Deploy Simples (Detecção Automática)

1. **Configure apenas a URL da API** na plataforma de deploy:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api-real.com
   ```

2. Faça o deploy normalmente
   ```bash
   npm run build
   ```

3. **Pronto!** 🎉 
   - Desenvolvimento: usa dados locais automaticamente
   - Produção: usa API automaticamente

### Opção 2: Deploy com Controle Manual

Se você quiser **forçar** um comportamento específico:

**No Vercel/Netlify/Railway:**
```
NEXT_PUBLIC_USE_LOCAL_DATA=false
NEXT_PUBLIC_API_URL=https://sua-api-real.com
```

**Localmente (.env.local):**
```env
NEXT_PUBLIC_USE_LOCAL_DATA=false
NEXT_PUBLIC_API_URL=https://sua-api-real.com
```

## 🧪 Como Testar

### Teste Local (dados locais)
```bash
npm run dev
# Abra console (F12) → deve ver: "🔧 Usando dados locais"
```

### Teste Produção Localmente (com API)
```bash
# Crie .env.local:
echo "NEXT_PUBLIC_USE_LOCAL_DATA=false" > .env.local
echo "NEXT_PUBLIC_API_URL=https://sua-api.com" >> .env.local

npm run build
npm start
# Abra console (F12) → deve ver: "🌐 Modo produção: buscando dados da API"
```

### Teste em Produção Real
```bash
# Deploy no Vercel/Netlify
# Console deve mostrar: "🌐 Modo produção: buscando dados da API"
```

## 🔍 Debug

Abra o console do navegador (F12) e veja:

```
🔍 Ambiente: {
  NODE_ENV: "development" ou "production",
  isDevelopment: true ou false,
  useLocalData: true ou false
}
```

Possíveis mensagens:
- ✅ `🔧 Usando dados locais` → Modo desenvolvimento
- ✅ `🌐 Modo produção: buscando dados da API` → Modo produção
- ✅ `✅ Dados carregados da API com sucesso: 2 carrosséis` → API funcionou
- ❌ `❌ Erro ao buscar dados da API: [erro]` → API falhou, mostra tela de erro

## 🚨 Tratamento de Erros

### Como funciona:

**Desenvolvimento (`npm run dev`):**
- ✅ Sempre usa dados locais
- ✅ Sem chamadas de API
- ✅ Nunca mostra erro

**Produção (`npm run build`):**
- 🌐 Faz chamada para a API
- ✅ Sucesso → Mostra produtos
- ❌ Erro → Mostra tela de erro com botão "Try Again"
- 🚫 **NÃO usa fallback automático**

### Estados da UI:

| Estado | O que aparece |
|--------|---------------|
| Loading | Skeleton animado (2 carrosséis) |
| Erro de API | ⚠️ Tela vermelha com mensagem de erro + botão retry |
| API vazia | 📦 Mensagem "No products available" |
| Sucesso | 🎉 Carrosséis com produtos |

## 🎯 Recomendações

### Para Desenvolvimento
- ✅ **Não configure nada**, deixe automático
- ✅ Use `npm run dev`
- ✅ Dados locais carregam instantaneamente

### Para Produção
- ✅ Configure apenas `NEXT_PUBLIC_API_URL`
- ✅ Deixe a detecção automática funcionar
- ✅ Certifique-se que a API está funcionando antes do deploy
- ⚠️ Se a API falhar, usuários verão tela de erro (sem fallback)

### Para Testes de Integração
- Configure `NEXT_PUBLIC_USE_LOCAL_DATA=false` temporariamente
- Teste contra API de staging/development
- Reverta depois dos testes

## 📝 Exemplo: Deploy no Vercel

1. Push para o GitHub
2. Conecte no Vercel
3. Configure apenas 1 variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL → https://sua-api-real.com
   ```
4. Deploy! 🚀

O Vercel automaticamente define `NODE_ENV=production`, então:
- ✅ Detecção automática funciona
- ✅ Usa API em produção
- ✅ Usa dados locais em development previews

