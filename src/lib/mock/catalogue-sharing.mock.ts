export interface ICategoryProp {
  id: string;
  name: string;
}

export interface IProductProp {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku?: string;
  stock: number;
  currency: string;
  category?: {
    name: string;
  };
  media?: Array<{
    id: string;
    url: string;
  }>;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

// Mock data for demonstration
const mockCategories: ICategoryProp[] = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Fashion' },
  { id: 'cat3', name: 'Home & Kitchen' },
  { id: 'cat4', name: 'Beauty & Personal Care' },
];

const mockProducts: IProductProp[] = [
  {
    id: 'prod1',
    name: 'Smartphone X',
    slug: 'smartphone-x',
    description: 'Latest model smartphone with advanced features.',
    price: 799.99,
    sku: 'SMARTX001',
    stock: 50,
    currency: 'USD',
    category: { name: 'Electronics' },
  },
  {
    id: 'prod2',
    name: 'Designer Dress',
    slug: 'designer-dress',
    description: 'Elegant dress for special occasions.',
    price: 120.0,
    sku: 'DRESS001',
    stock: 20,
    currency: 'USD',
    category: { name: 'Fashion' },
  },
  {
    id: 'prod3',
    name: 'Smart Coffee Maker',
    slug: 'smart-coffee-maker',
    description: 'Brew your coffee with a touch of a button.',
    price: 89.5,
    sku: 'COFFEEMK001',
    stock: 30,
    currency: 'USD',
    category: { name: 'Home & Kitchen' },
  },
  {
    id: 'prod4',
    name: 'Luxury Perfume',
    slug: 'luxury-perfume',
    description: 'A captivating scent for everyday elegance.',
    price: 65.0,
    sku: 'PERFUME001',
    stock: 40,
    currency: 'USD',
    category: { name: 'Beauty & Personal Care' },
  },
  {
    id: 'prod5',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'High-fidelity sound with comfortable design.',
    price: 199.99,
    sku: 'HEADPHONES001',
    stock: 75,
    currency: 'USD',
    category: { name: 'Electronics' },
  },
  {
    id: 'prod6',
    name: 'Casual T-Shirt',
    slug: 'casual-t-shirt',
    description: 'Comfortable cotton t-shirt for daily wear.',
    price: 25.0,
    sku: 'TSHIRT001',
    stock: 100,
    currency: 'USD',
    category: { name: 'Fashion' },
  },
  {
    id: 'prod7',
    name: 'Blender Pro',
    slug: 'blender-pro',
    description: 'Powerful blender for smoothies and more.',
    price: 75.0,
    sku: 'BLENDER001',
    stock: 25,
    currency: 'USD',
    category: { name: 'Home & Kitchen' },
    // media: [{ id: 'img7', url: 'https://via.placeholder.com/150/800080/FFFFFF?text=Blender' }],
  },
  {
    id: 'prod8',
    name: 'Face Serum',
    slug: 'face-serum',
    description: 'Rejuvenating serum for radiant skin.',
    price: 45.0,
    sku: 'SERUM001',
    stock: 60,
    currency: 'USD',
    category: { name: 'Beauty & Personal Care' },
    // media: [{ id: 'img8', url: 'https://via.placeholder.com/150/FFA500/000000?text=Serum' }],
  },
];

export const getCategories = async (): Promise<ICategoryProp[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 500); // Simulate network delay
  });
};

export const getProducts = async (categoryId?: string, searchQuery?: string): Promise<IProductProp[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = mockProducts;

      if (categoryId) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.category?.name.toLowerCase() === mockCategories.find((c) => c.id === categoryId)?.name.toLowerCase()
        );
      }

      if (searchQuery) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      resolve(filteredProducts);
    }, 700); // Simulate network delay
  });
};
