export interface CreateProductInput {
  businessProfileId: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  sku?: string;
  stock?: number;
  brandId?: string;
  imageUrl?: string;
}

export interface UpdateProductInput {
  id: string;
  businessProfileId: string; // Ensure the product belongs to the correct business
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  sku?: string;
  stock?: number;
  brandId?: string;
  imageUrl?: string;
}
