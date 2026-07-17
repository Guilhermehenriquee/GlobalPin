export type Category = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  salePrice?: number;
  images: string[];
  stock: number;
  sku: string;
  category: string;
  categorySlug: string;
  brand: string;
  size: string[];
  color: string[];
  variations: string[];
  rating: number;
  reviews: number;
  featured?: boolean;
  bestSeller?: boolean;
  promotion?: boolean;
  specs: Record<string, string>;
  related: string[];
  modality: string;
};

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type OrderStatus =
  | "aguardando pagamento"
  | "pago"
  | "em separacao"
  | "enviado"
  | "entregue"
  | "cancelado";
