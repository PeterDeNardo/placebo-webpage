/**
 * Serviço de Validação
 * 
 * Centraliza todas as validações com:
 * - Sanitização de inputs
 * - Validação de paths
 * - Validação de tokens
 * - Validação de schemas
 */

import { z } from 'zod';

class ValidationService {
  /**
   * Valida formato de token JWT
   */
  validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // JWT format: header.payload.signature
    const jwtPattern = /^[\w-]+\.[\w-]+\.[\w-]+$/;
    return jwtPattern.test(token);
  }

  /**
   * Sanitiza e valida path para imports dinâmicos
   * Previne path traversal attacks
   */
  validatePath(path: string): string {
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid path: must be a non-empty string');
    }

    // Remove tentativas de path traversal
    let sanitized = path
      .replace(/\.\./g, '') // Remove ../
      .replace(/\/+/g, '/') // Remove múltiplas barras
      .replace(/^\//, '')   // Remove barra inicial
      .trim();

    // Garante que está dentro de Data/
    if (!sanitized.startsWith('Data/')) {
      sanitized = `Data/${sanitized}`;
    }

    // Valida caracteres permitidos
    const validPathPattern = /^Data\/[\w\/-]+$/;
    if (!validPathPattern.test(sanitized)) {
      throw new Error('Invalid path: contains forbidden characters');
    }

    return sanitized;
  }

  /**
   * Valida email
   */
  validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /**
   * Valida URL
   */
  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Valida objeto User do localStorage
   */
  validateUser(obj: unknown): obj is { id: string; name: string; email: string } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'email' in obj &&
      typeof (obj as any).id === 'string' &&
      typeof (obj as any).name === 'string' &&
      typeof (obj as any).email === 'string' &&
      this.validateEmail((obj as any).email)
    );
  }

  /**
   * Sanitiza mensagem de erro para produção
   * Remove paths, IPs e informações sensíveis
   */
  sanitizeErrorMessage(message: string): string {
    if (!message) return 'An error occurred';

    return message
      .replace(/\/[\w\/-]+/g, '[path]')           // Remove paths
      .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[ip]') // Remove IPs
      .replace(/localhost:\d+/g, '[host]')        // Remove localhost:port
      .replace(/https?:\/\/[\w.-]+/g, '[url]')    // Remove URLs
      .replace(/[a-f0-9]{32,}/gi, '[hash]');      // Remove hashes
  }

  /**
   * Valida dados com schema Zod
   */
  validateSchema<T>(data: unknown, schema: z.ZodSchema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(`Validation failed: ${message}`);
      }
      throw error;
    }
  }

  /**
   * Sanitiza objeto removendo campos sensíveis
   */
  sanitizeObject<T extends Record<string, any>>(obj: T, sensitiveKeys: string[] = []): T {
    const defaultSensitive = ['password', 'token', 'secret', 'apiKey', 'authorization', 'cookie'];
    const allSensitive = [...defaultSensitive, ...sensitiveKeys];

    const sanitized = { ...obj };

    for (const key of Object.keys(sanitized)) {
      if (allSensitive.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Valida e sanitiza string JSON do localStorage
   */
  parseLocalStorage<T>(value: string | null, validator?: (obj: unknown) => obj is T): T | null {
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);
      
      if (validator && !validator(parsed)) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}

export const validationService = new ValidationService();

