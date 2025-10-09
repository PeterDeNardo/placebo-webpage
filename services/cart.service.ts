/**
 * Serviço de Carrinho
 * 
 * Gerencia todas as operações do carrinho:
 * - Adicionar/remover items
 * - Atualizar quantidades
 * - Calcular totais
 * - Aplicar cupons
 * - Gerenciar frete
 */

import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/constants';
import type { CartData, CartItem } from '@/types';

class CartService {
  /**
   * Busca dados do carrinho
   */
  async getCart(): Promise<CartData> {
    return await apiService.fetch<CartData>(
      API_ENDPOINTS.CART,
      'cartData'
    );
  }

  /**
   * Adiciona item ao carrinho
   */
  async addItem(item: Omit<CartItem, 'id'>): Promise<CartData> {
    return await apiService.post<CartData>(
      `${API_ENDPOINTS.CART}/items`,
      item
    );
  }

  /**
   * Remove item do carrinho
   */
  async removeItem(itemId: string): Promise<CartData> {
    return await apiService.delete<CartData>(
      `${API_ENDPOINTS.CART}/items/${itemId}`
    );
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateQuantity(itemId: string, quantity: number): Promise<CartData> {
    return await apiService.put<CartData>(
      `${API_ENDPOINTS.CART}/items/${itemId}`,
      { quantity }
    );
  }

  /**
   * Aplica cupom de desconto
   */
  async applyPromoCode(code: string): Promise<CartData> {
    return await apiService.post<CartData>(
      `${API_ENDPOINTS.CART}/promo`,
      { code }
    );
  }

  /**
   * Atualiza opção de frete
   */
  async updateShipping(shippingId: string): Promise<CartData> {
    return await apiService.put<CartData>(
      `${API_ENDPOINTS.CART}/shipping`,
      { shippingId }
    );
  }

  /**
   * Finaliza compra
   */
  async checkout(): Promise<{ orderId: string; redirectUrl: string }> {
    return await apiService.post<{ orderId: string; redirectUrl: string }>(
      `${API_ENDPOINTS.CART}/checkout`,
      {}
    );
  }

  /**
   * Limpa carrinho
   */
  async clearCart(): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.CART}`);
  }
}

export const cartService = new CartService();

