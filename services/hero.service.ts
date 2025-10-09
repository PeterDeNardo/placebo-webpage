/**
 * Serviço de Hero
 * 
 * Gerencia dados do Hero/Banner principal
 */

import { apiService } from './api.service';
import { cacheService } from './cache.service';
import { API_ENDPOINTS } from '@/constants';
import type { HeroData } from '@/types';

class HeroService {
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos (hero muda menos)

  /**
   * Busca dados do Hero
   */
  async getHero(): Promise<HeroData | null> {
    const cacheKey = 'hero:main';
    
    // Tenta cache primeiro
    const cached = cacheService.get<HeroData>(cacheKey);
    if (cached) return cached;

    try {
      // Busca da API/local
      const data = await apiService.fetch<HeroData>(
        API_ENDPOINTS.HERO,
        'heroData'
      );

      // Salva no cache
      cacheService.set(cacheKey, data, this.CACHE_TTL);
      
      return data;
    } catch (error) {
      // Hero falha silenciosamente
      console.warn('Hero não disponível:', error);
      return null;
    }
  }

  /**
   * Invalida cache do Hero
   */
  invalidateCache(): void {
    cacheService.clearByPrefix('hero:');
  }
}

export const heroService = new HeroService();

