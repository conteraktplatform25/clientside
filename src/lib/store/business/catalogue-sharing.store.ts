import { create } from 'zustand';
import {
  TCategoryResponse,
  TCategoryResponseList,
  TCreateProductRequest,
} from '@/lib/hooks/business/catalogue-sharing.hook';
import { TCategoryDropDown } from '@/lib/schemas/business/client/client-catalogue.schema';

interface CategoryCatalogueState {
  addedCategories: TCategoryResponseList;
  // allCategories: TCreateCategoryRequest[];
  dropDownCategories: TCategoryDropDown[];
  addCategory: (category: TCategoryResponse) => void;
  // commitAddedCategories: () => void;
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
  catalogueProducts: TCreateProductRequest[]; // New state for the main catalogue
  //addProduct: (product: IProductCatalogueProp) => void;
  addedProductsToCatalogue: (products: TCreateProductRequest[]) => void; // New action to move products
  //clearAddedProducts: () => void;
}

export const useProductCatalogueStore = create<ProductCatalogueState>((set) => ({
  catalogueProducts: [], // Initialize with dummy data
  addedProductsToCatalogue: (products) => set({ catalogueProducts: products }),
}));
