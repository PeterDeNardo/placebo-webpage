/**
 * Hook de Carrinho
 * 
 * Hook especializado para gerenciar o carrinho de compras
 */

import { useState, useCallback } from 'react';
import { useApiData } from './useApiData';
import { cartService } from '@/services/cart.service';
import type { CartData, CartItem } from '@/types';

/**
 * Hook principal do carrinho
 */
export function useCart() {
  const { data, loading, error, refetch } = useApiData<CartData>({
    fetchFn: () => cartService.getCart(),
  });

  const [updating, setUpdating] = useState(false);

  /**
   * Atualiza quantidade de um item
   */
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdating(true);
    try {
      await cartService.updateQuantity(itemId, quantity);
      await refetch();
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  /**
   * Remove item do carrinho
   */
  const removeItem = useCallback(async (itemId: string) => {
    setUpdating(true);
    try {
      await cartService.removeItem(itemId);
      await refetch();
    } catch (err) {
      console.error('Erro ao remover item:', err);
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  /**
   * Aplica cupom de desconto
   */
  const applyPromoCode = useCallback(async (code: string) => {
    setUpdating(true);
    try {
      await cartService.applyPromoCode(code);
      await refetch();
      return true;
    } catch (err) {
      console.error('Erro ao aplicar cupom:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  /**
   * Atualiza opção de frete
   */
  const updateShipping = useCallback(async (shippingId: string) => {
    setUpdating(true);
    try {
      await cartService.updateShipping(shippingId);
      await refetch();
    } catch (err) {
      console.error('Erro ao atualizar frete:', err);
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  /**
   * Finaliza compra
   */
  const checkout = useCallback(async () => {
    setUpdating(true);
    try {
      const result = await cartService.checkout();
      return result;
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  /**
   * Adiciona item ao carrinho
   */
  const addItem = useCallback(async (item: Omit<CartItem, 'id'>) => {
    setUpdating(true);
    try {
      await cartService.addItem(item);
      await refetch();
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  return {
    cart: data,
    loading,
    error,
    updating,
    updateQuantity,
    removeItem,
    applyPromoCode,
    updateShipping,
    checkout,
    addItem,
    refetch,
  };
}

