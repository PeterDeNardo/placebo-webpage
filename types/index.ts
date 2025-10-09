/**
 * Tipos Centralizados da Aplicação
 * 
 * Todos os tipos e interfaces compartilhados em um único lugar
 */

// ==================== PRODUCT TYPES ====================

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  route: string;
  category?: string;
  filters?: Record<string, any>;
}

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  alt: string;
}

export interface ProductDetails extends Product {
  media: ProductMedia;
  features: string[];
  specifications: Record<string, string>;
  stock: boolean;
  currency: string;
}

// ==================== HERO TYPES ====================

export interface HeroButton {
  text: string;
  href: string;
  variant: 'primary' | 'outline';
}

export interface HeroContent {
  title: string;
  subtitle?: string;
  buttons?: HeroButton[];
}

export interface HeroData {
  enabled: boolean;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  videoFormat?: 'mp4' | 'webm' | 'ogg';
  posterImage?: string | null;
  overlayOpacity?: number;
  content?: HeroContent;
  showScrollIndicator?: boolean;
}

// ==================== CATEGORY TYPES ====================

export interface CategoryData {
  title: string;
  hero?: HeroData;
  products: Product[];
}

// ==================== CAROUSEL TYPES ====================

export interface Carousel {
  title: string;
  products: Product[];
}

export interface HomeFeedData {
  carousels: Carousel[];
}

// ==================== HEADER TYPES ====================

export interface SubMenuItem {
  title: string;
  route: string;
  icon?: string;
  description?: string;
}

export interface HeaderItem {
  title: string;
  route: string;
  description?: string;
  submenu?: SubMenuItem[];
  authRequired?: boolean;
}

export interface HeaderData {
  leftNavigation: HeaderItem[];
  rightNavigation: HeaderItem[];
}

// ==================== CART TYPES ====================

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  cost: number;
  deliveryTime: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CartData {
  items: CartItem[];
  shippingOptions: ShippingOption[];
  summary: CartSummary;
  promoCode?: {
    code: string;
    discount: number;
  };
}

// ==================== API TYPES ====================

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// ==================== AUTH TYPES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

// ==================== FILTER TYPES ====================

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

// ==================== BLOG TYPES ====================

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  excerpt: string;
  content?: string;
  featured?: boolean;
}

export interface BlogData {
  hero: {
    title: string;
    description: string;
  };
  posts: BlogPost[];
}

// ==================== COMMON TYPES ====================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

