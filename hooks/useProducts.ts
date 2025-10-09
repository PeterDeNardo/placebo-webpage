/**
 * Hook de Produtos
 * 
 * Hooks especializados para operações com produtos
 */

import { useApiData } from './useApiData';
import { productService } from '@/services/product.service';
import type { Carousel, CategoryData, ProductDetails } from '@/types';

/**
 * Hook para buscar carrosséis da home
 */
export function useCarousels() {
  return useApiData<Carousel[]>({
    fetchFn: () => productService.getCarousels(),
  });
}

/**
 * Hook para buscar dados de uma categoria
 */
export function useCategory(categoryPath: string) {
  return useApiData<CategoryData>({
    fetchFn: () => productService.getCategory(categoryPath),
    enabled: !!categoryPath,
    deps: [categoryPath],
  });
}

/**
 * Hook para buscar detalhes de um produto
 */
export function useProduct(productId: string) {
  return useApiData<ProductDetails>({
    fetchFn: () => productService.getProduct(productId),
    enabled: !!productId,
    deps: [productId],
  });
}

