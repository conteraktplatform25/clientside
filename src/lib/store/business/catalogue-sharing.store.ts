import { create } from 'zustand';
import {
  TCategoryResponse,
  TCategoryResponseList,
  //TCreateCategoryRequest,
  TCreateProductRequest,
} from '@/lib/hooks/business/catalogue-sharing.hook';
import { TCategoryDropDown } from '@/lib/schemas/business/client/client-catalogue.schema';

interface CategoryCatalogueState {
  addedCategories: TCategoryResponseList;
  // allCategories: TCreateCategoryRequest[];
  dropDownCategories: TCategoryDropDown[];
  addCategory: (category: TCategoryResponse) => void;
  // commitAddedCategories: () => void;
  // clearAddedCategories: () => void;
  setAllCategories: (categories: TCategoryResponseList) => void;
  setCategoriesDropDown: (categories: TCategoryResponse[]) => void;
}

export const useCategoryCatalogueStore = create<CategoryCatalogueState>((set) => ({
  addedCategories: [],
  //allCategories: [],
  dropDownCategories: [],
  addCategory: (category) =>
    set((state) => ({
      addedCategories: [category, ...state.addedCategories],
    })),
  setAllCategories: (categories) => set({ addedCategories: categories }),
  setCategoriesDropDown: (categories) => set({ dropDownCategories: categories }),
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
