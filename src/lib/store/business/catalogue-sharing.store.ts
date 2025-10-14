import { create } from 'zustand';
//import { Product } from '@/types/product';
import { IProductCatalogueProp } from '@/type/client/business/product-catalogue.type';

// Dummy Data for Products - moved here to be part of the store's initial state
const INITIAL_DUMMY_PRODUCTS: IProductCatalogueProp[] = Array.from({ length: 25 }, (_, i) => ({
  id: `prod-${i + 1}`,
  imageUrl: '', // Placeholder image
  category: i % 3 === 0 ? 'Clothing' : i % 3 === 1 ? 'Electronics' : 'Home Goods',
  name: `Loafers ${i + 1}`,
  description:
    'It takes inspiration from vintage design to create the Dice Lo sneakers. Displaying a design in black, the p...',
  amount: 35000 + i * 100,
  currency: '₦',
  availability: i % 5 === 0 ? 'Out of Stock' : 'Available',
}));

interface ProductCatalogueState {
  addedProducts: IProductCatalogueProp[];
  catalogueProducts: IProductCatalogueProp[]; // New state for the main catalogue
  addProduct: (product: IProductCatalogueProp) => void;
  addAddedProductsToCatalogue: () => void; // New action to move products
  clearAddedProducts: () => void;
}

export const useProductCatalogueStore = create<ProductCatalogueState>((set) => ({
  addedProducts: [],
  catalogueProducts: INITIAL_DUMMY_PRODUCTS, // Initialize with dummy data
  addProduct: (product) =>
    set((state) => ({
      addedProducts: [product, ...state.addedProducts],
    })),
  addAddedProductsToCatalogue: () =>
    set((state) => ({
      catalogueProducts: [...state.addedProducts, ...state.catalogueProducts],
      addedProducts: [], // Clear added products after moving them
    })),
  clearAddedProducts: () => set({ addedProducts: [] }),
}));
