/**
 * Configuração da aplicação
 * 
 * Detecta automaticamente o ambiente:
 * - Desenvolvimento (npm run dev): usa dados locais
 * - Produção (npm run build + start): usa API
 * 
 * Para forçar um modo específico, use variáveis de ambiente:
 * - NEXT_PUBLIC_USE_LOCAL_DATA=true/false
 * - NEXT_PUBLIC_API_URL=https://sua-api.com
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const appConfig = {
  // Detecta automaticamente: desenvolvimento = local, produção = API
  // Pode ser sobrescrito com NEXT_PUBLIC_USE_LOCAL_DATA
  USE_LOCAL_DATA: process.env.NEXT_PUBLIC_USE_LOCAL_DATA 
    ? process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true'
    : isDevelopment, // ← Automático baseado no ambiente
  
  // URL da API (configure via variável de ambiente em produção)
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  
  // Endpoints
  CAROUSELS_ENDPOINT: '/carousels',
  HERO_ENDPOINT: '/hero',
  
  // Variáveis para debug
  NODE_ENV: process.env.NODE_ENV,
  IS_DEVELOPMENT: isDevelopment,
} as const;

