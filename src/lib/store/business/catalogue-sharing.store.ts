import { create } from 'zustand';
import {
  TCategoryDDValue,
  TCreateCategoryRequest,
  TCreateProductRequest,
} from '@/lib/hooks/business/catalogue-sharing.hook';

interface CategoryCatalogueState {
  addedCategories: TCreateCategoryRequest[];
  allCategories: TCreateCategoryRequest[];
  ddCategories: TCategoryDDValue[];
  addCategory: (category: TCreateCategoryRequest) => void;
  commitAddedCategories: () => void;
  clearAddedCategories: () => void;
  setAllCategories: (categories: TCreateCategoryRequest[]) => void;
  setDDCategories: (categories: TCategoryDDValue[]) => void;
}

export const useCategoryCatalogueStore = create<CategoryCatalogueState>((set) => ({
  addedCategories: [],
  allCategories: [],
  ddCategories: [],
  addCategory: (category) =>
    set((state) => ({
      addedCategories: [category, ...state.addedCategories],
    })),
  commitAddedCategories: () =>
    set((state) => ({
      allCategories: [...state.addedCategories, ...state.allCategories],
      addedCategories: [],
    })),
  clearAddedCategories: () => set({ addedCategories: [] }),
  setAllCategories: (categories) => set({ allCategories: categories }),
  setDDCategories: (categories) => set({ ddCategories: categories }),
}));

interface ProductCatalogueState {
  catalogueProducts: TCreateProductRequest[]; // New state for the main catalogue
  //addProduct: (product: IProductCatalogueProp) => void;
  addedProductsToCatalogue: (products: TCreateProductRequest[]) => void; // New action to move products
  //clearAddedProducts: () => void;
}

export const useProductCatalogueStore = create<ProductCatalogueState>((set) => ({
  catalogueProducts: [], // Initialize with dummy data
  addedProductsToCatalogue: (products) => set({ catalogueProducts: products }),
}));
