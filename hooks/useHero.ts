/**
 * Hook de Hero
 * 
 * Hook para buscar dados do Hero/Banner principal
 */

import { useApiData } from './useApiData';
import { heroService } from '@/services/hero.service';
import type { HeroData } from '@/types';

/**
 * Hook para buscar dados do Hero
 */
export function useHero() {
  return useApiData<HeroData | null>({
    fetchFn: () => heroService.getHero(),
  });
}

