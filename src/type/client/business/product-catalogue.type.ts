export interface IProductCatalogueProp {
  id: string;
  name: string;
  price: number;
  description: string;
  currency: string;
  stock?: number; // Optional stock quantity
  category?: {
    name: string;
  } | null;
  media?: { url: string }[];
  sku?: string; // Optional SKU
  imageUrl?: string;
  availability?: 'Available' | 'Out of Stock';
}
