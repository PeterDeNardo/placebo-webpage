/**
 * Hook de Blog
 * 
 * Hooks especializados para operações com blog
 */

import { useApiData } from './useApiData';
import { blogService } from '@/services/blog.service';
import type { BlogData, BlogPost } from '@/types';

/**
 * Hook para buscar dados do blog
 */
export function useBlog() {
  return useApiData<BlogData>({
    fetchFn: () => blogService.getBlogData(),
  });
}

/**
 * Hook para buscar posts por categoria
 */
export function useBlogByCategory(category?: string) {
  return useApiData<BlogPost[]>({
    fetchFn: () => blogService.getPostsByCategory(category || ''),
    enabled: true,
    deps: [category],
  });
}

/**
 * Hook para buscar post individual
 */
export function useBlogPost(slug: string) {
  return useApiData<BlogPost | null>({
    fetchFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
    deps: [slug],
  });
}

