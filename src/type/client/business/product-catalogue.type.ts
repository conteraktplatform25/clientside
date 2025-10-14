export interface IProductCatalogueProp {
  id: string;
  imageUrl: string; // This will be the URL or base64 string of the main image
  category: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  availability: 'Available' | 'Out of Stock';
  sku?: string; // Optional SKU
  stockQuantity?: number; // Optional stock quantity
  images?: string[]; // Array of image URLs/base64 strings
}
