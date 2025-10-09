/**
 * Serviço de Produtos
 * 
 * Gerencia todas as operações relacionadas a produtos:
 * - Listagem de produtos
 * - Detalhes de produto
 * - Produtos por categoria
 * - Carrosséis da home
 * - Cache automático
 */

import { apiService } from './api.service';
import { cacheService } from './cache.service';
import { API_ENDPOINTS } from '@/constants';
import type { 
  Product, 
  ProductDetails, 
  Carousel, 
  HomeFeedData,
  CategoryData 
} from '@/types';

class ProductService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Busca carrosséis da home
   */
  async getCarousels(): Promise<Carousel[]> {
    const cacheKey = 'home:carousels';
    
    // Tenta cache primeiro
    const cached = cacheService.get<Carousel[]>(cacheKey);
    if (cached) return cached;

    // Busca da API/local
    const data = await apiService.fetch<HomeFeedData>(
      API_ENDPOINTS.CAROUSELS,
      'homeFeedData'
    );

    const carousels = data.carousels;
    
    // Salva no cache
    cacheService.set(cacheKey, carousels, this.CACHE_TTL);
    
    return carousels;
  }

  /**
   * Busca produtos de uma categoria
   * 
   * @param categoryPath - Caminho da categoria (ex: 'novidades', 'marcas/nike')
   */
  async getCategory(categoryPath: string): Promise<CategoryData> {
    const cacheKey = `category:${categoryPath}`;
    
    // Tenta cache primeiro
    const cached = cacheService.get<CategoryData>(cacheKey);
    if (cached) return cached;

    // Busca da API/local
    const endpoint = `${API_ENDPOINTS.CATEGORIES}/${categoryPath}`;
    const localPath = `categories/${categoryPath}`;

    const data = await apiService.fetch<CategoryData>(endpoint, localPath);
    
    // Salva no cache
    cacheService.set(cacheKey, data, this.CACHE_TTL);
    
    return data;
  }

  /**
   * Busca detalhes de um produto específico
   * 
   * @param productId - ID do produto
   */
  async getProduct(productId: string): Promise<ProductDetails> {
    const cacheKey = `product:${productId}`;
    
    // Tenta cache primeiro
    const cached = cacheService.get<ProductDetails>(cacheKey);
    if (cached) return cached;

    // Busca da API/local
    const endpoint = `${API_ENDPOINTS.PRODUCTS}/${productId}`;
    const localPath = `products/product-${productId}`;

    const data = await apiService.fetch<ProductDetails>(endpoint, localPath);
    
    // Salva no cache (cache mais longo para detalhes)
    cacheService.set(cacheKey, data, this.CACHE_TTL * 2);
    
    return data;
  }

  /**
   * Busca produtos (genérico)
   * 
   * @param filters - Filtros opcionais
   */
  async getProducts(filters?: Record<string, any>): Promise<Product[]> {
    const cacheKey = `products:${JSON.stringify(filters || {})}`;
    
    // Tenta cache primeiro
    const cached = cacheService.get<Product[]>(cacheKey);
    if (cached) return cached;

    // Busca da API
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const endpoint = `${API_ENDPOINTS.PRODUCTS}${queryString}`;

    const data = await apiService.fetch<{ products: Product[] }>(endpoint);
    
    const products = data.products || [];
    
    // Salva no cache
    cacheService.set(cacheKey, products, this.CACHE_TTL);
    
    return products;
  }

  /**
   * Invalida cache de produtos
   * 
   * @param prefix - Prefixo específico ou 'all' para limpar tudo
   */
  invalidateCache(prefix: 'all' | 'home' | 'category' | 'product' = 'all'): void {
    if (prefix === 'all') {
      cacheService.clearByPrefix('home:');
      cacheService.clearByPrefix('category:');
      cacheService.clearByPrefix('product:');
      cacheService.clearByPrefix('products:');
    } else {
      cacheService.clearByPrefix(`${prefix}:`);
    }
  }
}

export const productService = new ProductService();

