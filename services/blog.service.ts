/**
 * Serviço de Blog
 * 
 * Gerencia todas as operações relacionadas ao blog:
 * - Listagem de posts
 * - Post individual
 * - Filtro por categoria
 * - Cache automático
 */

import { apiService } from './api.service';
import { cacheService } from './cache.service';
import { API_ENDPOINTS } from '@/constants';
import type { BlogData, BlogPost } from '@/types';

class BlogService {
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos

  /**
   * Busca todos os posts do blog
   */
  async getBlogData(): Promise<BlogData> {
    const cacheKey = 'blog:all';
    
    // Tenta cache primeiro
    const cached = cacheService.get<BlogData>(cacheKey);
    if (cached) return cached;

    // Busca da API/local
    const data = await apiService.fetch<BlogData>(
      API_ENDPOINTS.BLOG,
      'blogData'
    );

    // Salva no cache
    cacheService.set(cacheKey, data, this.CACHE_TTL);
    
    return data;
  }

  /**
   * Busca posts por categoria
   */
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const data = await this.getBlogData();
    
    if (!category) return data.posts;
    
    return data.posts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Busca post individual por slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const data = await this.getBlogData();
    
    return data.posts.find(post => post.slug === slug) || null;
  }

  /**
   * Busca categorias únicas
   */
  async getCategories(): Promise<string[]> {
    const data = await this.getBlogData();
    
    const categories = new Set<string>();
    data.posts.forEach(post => categories.add(post.category));
    
    return Array.from(categories).sort();
  }

  /**
   * Invalida cache do blog
   */
  invalidateCache(): void {
    cacheService.clearByPrefix('blog:');
  }
}

export const blogService = new BlogService();

