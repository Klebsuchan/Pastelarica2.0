export type PastelSize = 'P' | 'M' | 'G';

export interface ProductPrices {
  P: number;
  M: number;
  G: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  prices?: ProductPrices;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  whatsappNumber: string;
  menuVersion?: string;
}
