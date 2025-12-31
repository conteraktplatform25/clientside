import { create } from 'zustand';
import {
  TCategoryResponse,
  TCategoryResponseList,
  TProductDestopResponse,
  TProductResponse,
} from '@/lib/hooks/business/catalogue-sharing.hook';
import { TCategoryDropDown } from '@/lib/schemas/business/client/client-catalogue.schema';

interface CategoryCatalogueState {
  addedCategories: TCategoryResponseList;
  dropDownCategories: TCategoryDropDown[];
  addCategory: (category: TCategoryResponse) => void;
  clearAddedCategories: () => void;
  clearDropDownCategories: () => void;
  setAllCategories: (categories: TCategoryResponseList) => void;
  setCategoriesDropDown: (categories: TCategoryDropDown[]) => void;
}

export const useCategoryCatalogueStore = create<CategoryCatalogueState>((set) => ({
  addedCategories: [],
  dropDownCategories: [],
  addCategory: (category) =>
    set((state) => ({
      addedCategories: [category, ...state.addedCategories],
    })),
  setAllCategories: (categories) => set({ addedCategories: categories }),
  setCategoriesDropDown: (categories) => set({ dropDownCategories: categories }),
  clearAddedCategories: () => set({ addedCategories: [] }),
  clearDropDownCategories: () => set({ dropDownCategories: [] }),
}));

interface ProductCatalogueState {
  desktopProducts: TProductDestopResponse;
  catalogueProducts: TProductResponse[]; // New state for the main catalogue
  clearDesktopProducts: () => void;
  addedProductsToCatalogue: (products: TProductResponse[]) => void; // New action to move products
  setDesktopProducts: (products: TProductDestopResponse) => void;
}

export const useProductCatalogueStore = create<ProductCatalogueState>((set) => ({
  desktopProducts: [],
  catalogueProducts: [], // Initialize with dummy data
  clearDesktopProducts: () => set({ desktopProducts: [] }),
  addedProductsToCatalogue: (products) => set({ catalogueProducts: products }),
  setDesktopProducts: (products) => set({ desktopProducts: products }),
}));
