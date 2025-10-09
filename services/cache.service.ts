/**
 * Serviço de Cache em Memória
 * 
 * Sistema simples de cache client-side com:
 * - TTL (Time To Live)
 * - Invalidação por prefixo
 * - Limite de entradas (previne memory leak)
 * - Type-safe
 */

import { logger } from './logger.service';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_ENTRIES = 100; // Limite de entradas

  /**
   * Salva dados no cache
   * 
   * @param key - Chave única
   * @param data - Dados a serem cacheados
   * @param expiresIn - Tempo de expiração em ms (padrão: 5min)
   */
  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_TTL): void {
    // Limpa expirados antes de adicionar
    this.cleanExpired();
    
    // Se passou do limite, remove o mais antigo (FIFO)
    if (this.cache.size >= this.MAX_ENTRIES) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        logger.debug(`Cache limit reached, removed oldest: ${firstKey}`);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });

    logger.debug(`Cache set: ${key} (expires in ${expiresIn}ms)`);
  }

  /**
   * Recupera dados do cache
   * 
   * @param key - Chave única
   * @returns Dados ou null se expirado/não existe
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }
    
    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
    
    if (isExpired) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }
    
    logger.debug(`Cache hit: ${key}`);
    return entry.data as T;
  }

  /**
   * Limpa entradas expiradas
   */
  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logger.debug(`Cache cleaned: ${cleaned} expired entries removed`);
    }
  }

  /**
   * Verifica se existe no cache (sem retornar dados)
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove entrada específica
   */
  remove(key: string): void {
    this.cache.delete(key);
    logger.debug(`Cache removed: ${key}`);
  }

  /**
   * Limpa cache por prefixo
   * 
   * @param prefix - Prefixo das chaves (ex: 'products:')
   */
  clearByPrefix(prefix: string): void {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    logger.debug(`Cache cleared: ${count} entries with prefix "${prefix}"`);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    logger.debug(`Cache cleared: ${size} entries`);
  }

  /**
   * Retorna tamanho do cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Retorna todas as chaves
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Retorna estatísticas do cache
   */
  stats(): {
    total: number;
    expired: number;
    active: number;
  } {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const entry of this.cache.values()) {
      const isExpired = now - entry.timestamp > entry.expiresIn;
      if (isExpired) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      expired,
      active,
    };
  }
}

export const cacheService = new CacheService();

