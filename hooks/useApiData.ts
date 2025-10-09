/**
 * Hook Genérico de API
 * 
 * Hook reutilizável para buscar dados de qualquer serviço
 * Gerencia estados de loading, error e data automaticamente
 */

import { useState, useEffect, useCallback } from 'react';

interface UseApiDataOptions<T> {
  /** Função que retorna Promise com os dados */
  fetchFn: () => Promise<T>;
  
  /** Se false, não faz o fetch automático */
  enabled?: boolean;
  
  /** Callback executado quando dados são carregados */
  onSuccess?: (data: T) => void;
  
  /** Callback executado quando ocorre erro */
  onError?: (error: Error) => void;
  
  /** Array de dependências para refetch automático */
  deps?: any[];
}

interface UseApiDataReturn<T> {
  /** Dados carregados */
  data: T | null;
  
  /** Estado de carregamento */
  loading: boolean;
  
  /** Erro (se houver) */
  error: Error | null;
  
  /** Função para refazer o fetch */
  refetch: () => Promise<void>;
  
  /** Limpa o estado */
  reset: () => void;
}

/**
 * Hook para buscar dados de API
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useApiData({
 *   fetchFn: () => productService.getProducts(),
 *   onSuccess: (data) => console.log('Loaded:', data),
 * });
 * ```
 */
export function useApiData<T>({
  fetchFn,
  enabled = true,
  onSuccess,
  onError,
  deps = [],
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFn();
        
        // Só atualiza estado se componente ainda está montado
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

    // Cleanup: cancela updates se componente desmontar
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { 
    data, 
    loading, 
    error, 
    refetch,
    reset,
  };
}

