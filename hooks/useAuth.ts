/**
 * Hook de Autenticação
 * 
 * Gerencia o estado de autenticação da aplicação
 * Uso:
 * 
 * const { isAuthenticated, user, login, logout, register } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthService, User, RegisterData } from '@/services/auth.service';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação no mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      const userData = AuthService.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Auth check:', { authenticated, user: userData });
      }
    };

    checkAuth();
  }, []);

  /**
   * Realiza login
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Realiza registro
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await AuthService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Realiza logout
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };
}

