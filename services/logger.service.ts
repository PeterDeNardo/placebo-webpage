/**
 * Serviço de Logging
 * 
 * Centraliza todos os logs da aplicação com:
 * - Logs apenas em desenvolvimento
 * - Integração com serviços de monitoramento
 * - Sanitização de dados sensíveis
 */

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info';

interface LogMeta {
  [key: string]: any;
}

class LoggerService {
  private readonly isDev = process.env.NODE_ENV === 'development';
  private readonly isProd = process.env.NODE_ENV === 'production';

  /**
   * Log genérico (apenas em desenvolvimento)
   */
  log(message: string, meta?: LogMeta): void {
    this.write('log', message, meta);
  }

  /**
   * Log de informação
   */
  info(message: string, meta?: LogMeta): void {
    this.write('info', message, meta);
  }

  /**
   * Log de aviso
   */
  warn(message: string, meta?: LogMeta): void {
    this.write('warn', message, meta);
  }

  /**
   * Log de erro (sempre salva, mas sanitiza em produção)
   */
  error(message: string, error?: Error | unknown, meta?: LogMeta): void {
    const sanitizedMeta = this.isProd ? this.sanitizeMeta(meta) : meta;
    
    this.write('error', message, {
      ...sanitizedMeta,
      error: error instanceof Error ? error.message : String(error),
    });

    // Em produção, reporta para serviço de monitoramento
    if (this.isProd) {
      this.reportError(message, error, meta);
    }
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, meta?: LogMeta): void {
    if (this.isDev) {
      this.write('debug', message, meta);
    }
  }

  /**
   * Escreve log no console (com controle de ambiente)
   */
  private write(level: LogLevel, message: string, meta?: LogMeta): void {
    // Em produção, só mostra errors e warns
    if (this.isProd && (level === 'log' || level === 'debug')) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${level.toUpperCase()}] ${timestamp}`;
    
    if (meta && Object.keys(meta).length > 0) {
      console[level](`${prefix} ${message}`, meta);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }

  /**
   * Sanitiza metadados removendo informações sensíveis
   */
  private sanitizeMeta(meta?: LogMeta): LogMeta | undefined {
    if (!meta) return undefined;

    const sanitized = { ...meta };
    const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization'];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Reporta erro para serviço de monitoramento
   * TODO: Integrar com Sentry, CloudWatch, etc
   */
  private reportError(message: string, error?: Error | unknown, meta?: LogMeta): void {
    // TODO: Implementar integração com Sentry
    // Example:
    // Sentry.captureException(error, {
    //   contexts: { meta },
    //   tags: { source: 'logger.service' },
    // });
    
    if (this.isDev) {
      console.warn('TODO: Setup error reporting service (Sentry, etc)');
    }
  }

  /**
   * Log de performance
   */
  perf(label: string, duration: number): void {
    if (this.isDev) {
      console.log(`⏱️ [PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Marca início de operação (para medir performance)
   */
  time(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.perf(label, duration);
    };
  }
}

export const logger = new LoggerService();

