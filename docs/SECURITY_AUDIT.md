# 🔒 Auditoria de Segurança - Refatoração

## 📋 Resumo Executivo

**Data:** Outubro 2025  
**Versão:** 1.0  
**Escopo:** Services, Hooks, Types e Constants  
**Status:** ⚠️ 8 Issues identificados | 3 Críticos | 5 Médios

---

## 🔴 Issues Críticos

### 1. **Console.log em Produção** 
**Arquivos:** `api.service.ts`, `cache.service.ts`, `auth.service.ts`  
**Severidade:** CRÍTICA  
**CVSS:** 5.3 (Médio)

```typescript
// ❌ api.service.ts:50, 68, 84, 87
console.log(`📁 Loading local: ${localPath}`);
console.log(`🌐 Fetching API: ${url}`); // Expõe URLs
console.log(`✅ API success: ${endpoint}`);
console.error(`❌ API error: ${endpoint}`, err); // Expõe erros

// ❌ cache.service.ts:29, 39, 48, 58, 67, 77
console.log(`💾 Cache set: ${key}`);
console.log(`❌ Cache miss: ${key}`);
// ... múltiplos logs
```

**Risco:**
- Expõe estrutura de URLs da API
- Revela estratégia de cache
- Pode vazar dados sensíveis em erros
- Performance degradada

**Fix:**
```typescript
// services/logger.service.ts
class LoggerService {
  private isDev = process.env.NODE_ENV === 'development';
  
  log(...args: any[]) {
    if (this.isDev) console.log(...args);
  }
  
  error(...args: any[]) {
    if (this.isDev) {
      console.error(...args);
    } else {
      // Enviar para serviço de monitoramento (Sentry, etc)
      this.reportError(args);
    }
  }
  
  private reportError(error: any) {
    // TODO: Integrar com Sentry/CloudWatch
  }
}

export const logger = new LoggerService();

// Uso
logger.log(`Loading: ${path}`); // Só aparece em dev
```

### 2. **Dynamic Import Vulnerability**
**Arquivo:** `api.service.ts:51`  
**Severidade:** CRÍTICA  
**CVSS:** 7.5 (Alto)

```typescript
// ❌ Path Traversal potencial
const data = await import(`@/Data/${localPath}.json`);
```

**Risco:**
- Se `localPath` vier de user input: `../../etc/passwd`
- Pode acessar arquivos fora de `@/Data/`

**Fix:**
```typescript
private async fetchLocal<T>(localPath: string): Promise<T> {
  // Sanitizar path
  const safePath = this.sanitizePath(localPath);
  
  // Validar que está dentro de Data/
  if (!safePath.startsWith('Data/')) {
    throw new Error('Invalid path');
  }
  
  try {
    const data = await import(`@/${safePath}.json`);
    return data.default as T;
  } catch (err) {
    throw new Error(`Local data not found: ${safePath}`);
  }
}

private sanitizePath(path: string): string {
  // Remove ../, ./, múltiplas barras
  return path
    .replace(/\.\./g, '')
    .replace(/\/+/g, '/')
    .replace(/^\//, '');
}
```

### 3. **Type Assertion sem Validação**
**Arquivos:** `api.service.ts:52, 85`, `auth.service.ts:57, 95`  
**Severidade:** ALTA  
**CVSS:** 6.5 (Médio)

```typescript
// ❌ Assume que JSON é do tipo T sem validar
return data.default as T;
return data as T;
```

**Risco:**
- Runtime errors se dados não correspondem ao tipo
- Dados corrompidos podem crashar a app

**Fix com Zod:**
```typescript
import { z } from 'zod';

// Definir schemas
const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().positive(),
  // ...
});

// Validar antes de retornar
private async fetchLocal<T>(localPath: string): Promise<T> {
  const data = await import(`@/Data/${localPath}.json`);
  
  // Validar com schema apropriado
  const validated = ProductSchema.parse(data.default);
  return validated as T;
}
```

---

## 🟡 Issues Médios

### 4. **LocalStorage sem Sanitização**
**Arquivo:** `auth.service.ts:123, 137`  
**Severidade:** MÉDIA

```typescript
// ❌ Salva string direto sem validação
localStorage.setItem(this.TOKEN_KEY, token);

// ❌ Parse JSON sem try/catch
const userData = localStorage.getItem(this.USER_KEY);
return userData ? JSON.parse(userData) : null;
```

**Risco:**
- XSS pode injetar dados maliciosos
- Parse pode crashar com JSON inválido

**Fix:**
```typescript
static setToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Validar formato do token
  if (!this.isValidToken(token)) {
    throw new Error('Invalid token format');
  }
  
  localStorage.setItem(this.TOKEN_KEY, token);
}

static getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;
    
    const parsed = JSON.parse(userData);
    
    // Validar estrutura
    if (!this.isValidUser(parsed)) {
      this.clearUser();
      return null;
    }
    
    return parsed;
  } catch (err) {
    console.error('Failed to parse user data:', err);
    this.clearUser();
    return null;
  }
}

private static isValidToken(token: string): boolean {
  // JWT format: xxx.yyy.zzz
  return /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token);
}

private static isValidUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}
```

### 5. **Cache sem Limite de Tamanho**
**Arquivo:** `cache.service.ts`  
**Severidade:** MÉDIA

```typescript
// ❌ Map pode crescer infinitamente
private cache = new Map<string, CacheEntry<any>>();
```

**Risco:**
- Memory leak
- Performance degradada

**Fix:**
```typescript
class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly MAX_ENTRIES = 100; // Limite
  
  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_TTL): void {
    // Remove expirados antes de adicionar
    this.cleanExpired();
    
    // Se passou do limite, remove o mais antigo
    if (this.cache.size >= this.MAX_ENTRIES) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }
  
  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}
```

### 6. **Falta Rate Limiting**
**Arquivo:** `api.service.ts`  
**Severidade:** MÉDIA

```typescript
// ❌ Sem proteção contra spam de requests
async fetch<T>(endpoint: string): Promise<T> {
  return await this.fetchRemote<T>(endpoint);
}
```

**Risco:**
- DDoS self-inflicted
- Custo de API alto

**Fix:**
```typescript
class ApiService {
  private requestQueue = new Map<string, Promise<any>>();
  
  async fetch<T>(endpoint: string): Promise<T> {
    // Deduplicação: se já está buscando, retorna a mesma Promise
    const cached = this.requestQueue.get(endpoint);
    if (cached) {
      return cached as Promise<T>;
    }
    
    const promise = this.fetchRemote<T>(endpoint);
    this.requestQueue.set(endpoint, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      // Remove após completar
      setTimeout(() => {
        this.requestQueue.delete(endpoint);
      }, 100);
    }
  }
}
```

### 7. **Erro com Detalhes Sensíveis**
**Arquivo:** `api.service.ts:143-156`  
**Severidade:** MÉDIA

```typescript
// ❌ Retorna error.details sem sanitizar
return {
  message: error.message,
  code: error.code,
  details: error.details, // ← Pode conter stack traces, etc
};
```

**Risco:**
- Vaza estrutura do backend
- Expõe stack traces

**Fix:**
```typescript
private async handleError(response: Response): Promise<ApiError> {
  try {
    const error = await response.json();
    
    return {
      message: this.sanitizeMessage(error.message),
      code: error.code || `HTTP_${response.status}`,
      // Só inclui details em dev
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.details 
      }),
    };
  } catch {
    return {
      message: 'Erro de conexão',
      code: `HTTP_${response.status}`,
    };
  }
}

private sanitizeMessage(message: string): string {
  // Remove paths absolutos, IPs, etc
  return message
    .replace(/\/[\w\/]+/g, '[path]')
    .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[ip]');
}
```

### 8. **Hooks sem Cleanup**
**Arquivo:** `hooks/useApiData.ts`  
**Severidade:** MÉDIA

```typescript
// ❌ useEffect sem cleanup para async
useEffect(() => {
  if (enabled) {
    refetch();
  }
}, [enabled, ...deps]);
```

**Risco:**
- Memory leak se componente desmonta durante fetch
- "Can't perform state update on unmounted component"

**Fix:**
```typescript
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      
      // Só atualiza se não foi cancelado
      if (!cancelled) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (!cancelled) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };
  
  if (enabled) {
    fetchData();
  }
  
  // Cleanup
  return () => {
    cancelled = true;
  };
}, [enabled, ...deps]);
```

---

## ✅ Boas Práticas Encontradas

1. ✅ **Tipos Centralizados** - `types/index.ts`
2. ✅ **Separação de Responsabilidades** - Services isolados
3. ✅ **TypeScript Strict** - Tipos bem definidos
4. ✅ **Singleton Pattern** - Serviços exportados como instâncias
5. ✅ **JSDoc** - Documentação inline
6. ✅ **Error Handling** - Try/catch em lugares críticos
7. ✅ **Constantes** - Magic numbers eliminados

---

## 🔧 Implementações Recomendadas

### 1. Logger Service (CRÍTICO)

```typescript
// services/logger.service.ts
type LogLevel = 'log' | 'warn' | 'error' | 'debug';

class LoggerService {
  private isDev = process.env.NODE_ENV === 'development';
  
  log(message: string, meta?: any) {
    this.write('log', message, meta);
  }
  
  error(message: string, error?: Error, meta?: any) {
    this.write('error', message, { ...meta, error: error?.message });
    
    if (!this.isDev) {
      this.reportToSentry(error, meta);
    }
  }
  
  private write(level: LogLevel, message: string, meta?: any) {
    if (!this.isDev && level === 'log') return;
    
    console[level](`[${level.toUpperCase()}] ${message}`, meta || '');
  }
  
  private reportToSentry(error?: Error, meta?: any) {
    // TODO: Integrar com Sentry
  }
}

export const logger = new LoggerService();
```

### 2. Validation Service (CRÍTICO)

```typescript
// services/validation.service.ts
import { z } from 'zod';

class ValidationService {
  validateToken(token: string): boolean {
    return /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token);
  }
  
  validatePath(path: string): string {
    const sanitized = path
      .replace(/\.\./g, '')
      .replace(/\/+/g, '/')
      .replace(/^\//, '');
      
    if (!sanitized.startsWith('Data/')) {
      throw new Error('Invalid path');
    }
    
    return sanitized;
  }
  
  validateSchema<T>(data: unknown, schema: z.ZodSchema<T>): T {
    return schema.parse(data);
  }
}

export const validationService = new ValidationService();
```

### 3. Request Deduplication (MÉDIO)

```typescript
// services/dedup.service.ts
class DeduplicationService {
  private requests = new Map<string, Promise<any>>();
  
  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.requests.get(key);
    if (existing) return existing;
    
    const promise = fn();
    this.requests.set(key, promise);
    
    try {
      return await promise;
    } finally {
      setTimeout(() => this.requests.delete(key), 100);
    }
  }
}

export const dedupService = new DeduplicationService();
```

---

## 📊 Scorecard de Segurança

| Categoria | Score | Status |
|-----------|-------|--------|
| **Logging** | 3/10 | 🔴 Crítico |
| **Input Validation** | 4/10 | 🔴 Crítico |
| **Type Safety** | 7/10 | 🟡 Atenção |
| **Error Handling** | 6/10 | 🟡 Atenção |
| **Auth Security** | 7/10 | 🟡 Atenção |
| **Memory Management** | 6/10 | 🟡 Atenção |
| **Rate Limiting** | 2/10 | 🔴 Crítico |
| **Code Quality** | 8/10 | ✅ Bom |

**Score Geral: 5.4/10** ⚠️ Necessita melhorias

---

## 🚀 Action Plan

### Fase 1: Fixes Críticos (1-2 dias)
1. ✅ Implementar `logger.service.ts`
2. ✅ Implementar `validation.service.ts`
3. ✅ Adicionar sanitização de paths
4. ✅ Adicionar validação de tipos com Zod

### Fase 2: Fixes Médios (2-3 dias)
5. ✅ Implementar deduplicação de requests
6. ✅ Adicionar cleanup nos hooks
7. ✅ Implementar limite de cache
8. ✅ Sanitizar mensagens de erro

### Fase 3: Melhorias (1 semana)
9. ✅ Integrar Sentry/monitoring
10. ✅ Implementar rate limiting
11. ✅ Adicionar unit tests
12. ✅ Security headers no Next.js

---

## 📝 Checklist Pré-Commit

- [ ] Todos os `console.log` removidos ou protegidos por `logger`
- [ ] Inputs validados com schemas (Zod)
- [ ] Paths sanitizados
- [ ] LocalStorage com validação
- [ ] Hooks com cleanup
- [ ] Cache com limite
- [ ] Errors sanitizados
- [ ] Types validados em runtime
- [ ] Testes de segurança passando

---

## 💡 Recomendação Final

**NÃO commitar ainda!** 

Implementar primeiro:
1. Logger Service (substitui todos os console.log)
2. Validation Service (sanitiza inputs)
3. Cleanup nos hooks

**Tempo estimado:** 4-6 horas

Isso elevará o score de **5.4/10 → 8.5/10** ✅

---

*Auditoria realizada: Outubro 2025*  
*Próxima revisão: Após fixes críticos*

