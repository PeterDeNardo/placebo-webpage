/**
 * Serviço de Autenticação
 * 
 * Gerencia todas as operações de autenticação:
 * - Login/Logout
 * - Registro
 * - Gerenciamento de tokens
 * - Verificação de autenticação
 */

import { appConfig } from "@/config/app.config";
import { logger } from "./logger.service";
import { validationService } from "./validation.service";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'user';

  /**
   * Realiza login do usuário
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // TODO: Substituir por chamada real à API
      if (appConfig.USE_LOCAL_DATA) {
        // Simulação para desenvolvimento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockResponse: LoginResponse = {
          token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user: {
            id: '1',
            name: 'Usuário Teste',
            email,
          },
        };
        
        this.setToken(mockResponse.token);
        this.setUser(mockResponse.user);
        
        return mockResponse;
      }

      // Produção: chamada real à API
      const response = await fetch(`${appConfig.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data: LoginResponse = await response.json();
      
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  static async register(data: RegisterData): Promise<LoginResponse> {
    try {
      // TODO: Substituir por chamada real à API
      if (appConfig.USE_LOCAL_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockResponse: LoginResponse = {
          token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user: {
            id: '1',
            name: data.name,
            email: data.email,
          },
        };
        
        this.setToken(mockResponse.token);
        this.setUser(mockResponse.user);
        
        return mockResponse;
      }

      const response = await fetch(`${appConfig.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      const responseData: LoginResponse = await response.json();
      
      this.setToken(responseData.token);
      this.setUser(responseData.user);
      
      return responseData;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Salva token no localStorage
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    // Valida formato do token
    if (!validationService.validateToken(token)) {
      logger.error('Invalid token format', new Error('Token validation failed'));
      throw new Error('Invalid token format');
    }
    
    localStorage.setItem(this.TOKEN_KEY, token);
    logger.debug('Token saved successfully');
  }

  /**
   * Recupera token do localStorage
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    // Valida token ao recuperar
    if (token && !validationService.validateToken(token)) {
      logger.warn('Invalid token found in localStorage, clearing...');
      this.logout();
      return null;
    }
    
    return token;
  }

  /**
   * Salva dados do usuário
   */
  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    
    // Valida estrutura do usuário
    if (!validationService.validateUser(user)) {
      logger.error('Invalid user data', new Error('User validation failed'));
      throw new Error('Invalid user data');
    }
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    logger.debug('User data saved successfully');
  }

  /**
   * Recupera dados do usuário
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      
      // Valida estrutura
      if (!validationService.validateUser(parsed)) {
        logger.warn('Invalid user data in localStorage, clearing...');
        localStorage.removeItem(this.USER_KEY);
        return null;
      }
      
      return parsed;
    } catch (err) {
      logger.error('Failed to parse user data', err);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Realiza logout
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Recupera token com validação
   */
  static getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

