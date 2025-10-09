/**
 * Constantes da Aplicação
 * 
 * Centraliza todos os valores mágicos e configurações fixas
 */

export const API_ENDPOINTS = {
  CAROUSELS: '/carousels',
  HERO: '/hero',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CART: '/cart',
  BLOG: '/blog',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
} as const;

export const DELAYS = {
  AUTH_SIMULATION: 1500,
  MODAL_CLOSE: 300,
  AUTO_CLOSE: 5000,
  DEBOUNCE_SEARCH: 300,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const ANIMATION = {
  FADE_IN_DURATION: 400,
  FADE_IN_STAGGER: 50,
  TRANSITION_DURATION: 300,
} as const;

export const FILTER = {
  PRICE_STEP: 10,
  DEFAULT_PRICE_MIN: 0,
  DEFAULT_PRICE_MAX: 10000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  CART_ITEMS: 'cartItems',
  THEME: 'theme',
} as const;

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  REGISTER_SUCCESS: 'Conta criada com sucesso!',
  GENERIC_ERROR: 'Ocorreu um erro. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você precisa estar logado para continuar.',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CART: '/cart',
  BLOG: '/blog',
  PRODUCT: '/product',
  CATEGORY: '/categoria',
  SEARCH: '/search',
  ACCOUNT: '/account',
  ORDERS: '/encomendas',
} as const;

