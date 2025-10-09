/**
 * Serviço de API Genérico
 * 
 * Cliente HTTP centralizado com:
 * - Fallback para dados locais
 * - Autenticação automática
 * - Tratamento de erros
 * - Type-safe
 */

import { appConfig } from '@/config/app.config';
import { AuthService } from './auth.service';
import { logger } from './logger.service';
import { validationService } from './validation.service';
import type { ApiError } from '@/types';

class ApiService {
  private baseURL: string;
  private useLocal: boolean;

  constructor() {
    this.baseURL = appConfig.API_BASE_URL;
    this.useLocal = appConfig.USE_LOCAL_DATA;
  }

  /**
   * Fetch genérico com fallback local
   * 
   * @param endpoint - Endpoint da API (ex: '/products')
   * @param localPath - Caminho para JSON local (ex: 'products/product-1')
   * @param options - Opções do fetch
   */
  async fetch<T>(
    endpoint: string,
    localPath?: string,
    options?: RequestInit
  ): Promise<T> {
    // Modo desenvolvimento: usa dados locais
    if (this.useLocal && localPath) {
      return await this.fetchLocal<T>(localPath);
    }

    // Modo produção: busca da API
    return await this.fetchRemote<T>(endpoint, options);
  }

  /**
   * Busca dados locais (JSON)
   */
  private async fetchLocal<T>(localPath: string): Promise<T> {
    try {
      // Valida e sanitiza path
      const safePath = validationService.validatePath(localPath);
      logger.debug(`Loading local data: ${safePath}`);
      
      const data = await import(`@/${safePath}.json`);
      return data.default as T;
    } catch (err) {
      logger.error(`Local data not found: ${localPath}`, err);
      throw new Error(`Local data not found: ${localPath}`);
    }
  }

  /**
   * Busca da API remota
   */
  private async fetchRemote<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const endTime = logger.time(`API ${endpoint}`);
    
    try {
      const url = `${this.baseURL}${endpoint}`;
      logger.debug(`Fetching API: ${endpoint}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const data = await response.json();
      endTime(); // Log performance
      logger.debug(`API success: ${endpoint}`);
      return data as T;
    } catch (err) {
      logger.error(`API error: ${endpoint}`, err);
      throw err;
    }
  }

  /**
   * POST request
   */
  async post<T, D = any>(
    endpoint: string,
    data: D,
    options?: RequestInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, undefined, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T, D = any>(
    endpoint: string,
    data: D,
    options?: RequestInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, undefined, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, undefined, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Headers de autenticação
   */
  private getAuthHeaders(): Record<string, string> {
    const authHeader = AuthService.getAuthHeader();
    return authHeader ? { Authorization: authHeader } : {};
  }

  /**
   * Tratamento de erros da API
   */
  private async handleError(response: Response): Promise<ApiError> {
    try {
      const error = await response.json();
      
      // Sanitiza mensagem em produção
      const message = process.env.NODE_ENV === 'production'
        ? validationService.sanitizeErrorMessage(error.message || 'Erro desconhecido')
        : error.message || 'Erro desconhecido';
      
      return {
        message,
        code: error.code || `HTTP_${response.status}`,
        // Só inclui details em desenvolvimento
        ...(process.env.NODE_ENV === 'development' && error.details && { 
          details: error.details 
        }),
      };
    } catch {
      return {
        message: response.statusText || 'Erro de rede',
        code: `HTTP_${response.status}`,
      };
    }
  }

  /**
   * Verifica se está em modo local
   */
  isLocalMode(): boolean {
    return this.useLocal;
  }
}

export const apiService = new ApiService();

