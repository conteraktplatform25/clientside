import { useMutation, useQuery } from '@tanstack/react-query';
import { $Enums, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  CategoryDDSchema,
  CategoryDetailsSchema,
  CategoryResponseSchema,
  CreateCategorySchema,
  CreateProductSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { fetchJSON } from '@/utils/response';
import { useCategoryCatalogueStore, useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { getErrorMessage } from '@/utils/errors';

export type TCreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type TCategoryDetailsValue = z.infer<typeof CategoryDetailsSchema>;
export type TCreateCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCategoryDDValue = z.infer<typeof CategoryDDSchema>;

export type TCreateProductRequest = z.infer<typeof CreateProductSchema>;

/* -----------------------------
   🧱 Types
----------------------------- */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IProductProps {
  description: string | null;
  name: string;
  categoryId: string;
  id: string;
  status: $Enums.ProductStatus;
  created_at: Date;
  updated_at: Date;
  businessProfileId: string;
  currency: $Enums.CurrencyType;
  price: Prisma.Decimal;
  category?: { name: string };
  media?: Array<{ id: string; url: string }>;
  variants?: Array<{ id: string; name: string; price: number }>;
}

interface ProductResponse {
  products: TCreateProductRequest[];
  pagination: PaginationMeta;
}

/* ===============================
   🟢 Get Categories (Simple)
   =============================== */
export const useGetCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchJSON<{ categories: TCategoryDDValue[] }>('/api/catalogue/categories'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

/* ===============================
   🟢 Get Detailed Categories
   =============================== */
export const useGetDetailCategories = () => {
  return useQuery({
    queryKey: ['detail_categories'],
    queryFn: () =>
      fetchJSON<{
        categories: TCreateCategoryRequest[];
      }>('/api/catalogue/categories/details'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

/* ===============================
   🟢 Create Category (Local + API)
   =============================== */
export const useCreateCategory = () => {
  const addCategory = useCategoryCatalogueStore((state) => state.addCategory);
  const setAllCategories = useCategoryCatalogueStore((state) => state.setAllCategories);
  const allCategories = useCategoryCatalogueStore((state) => state.allCategories);

  return useMutation({
    mutationFn: async (payload: TCreateCategoryRequest) =>
      fetchJSON<{ category: TCreateCategoryRequest }>('/api/catalogue/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (response) => {
      // ✅ Immediately update local Zustand store without refetch
      const newCategory = response.category;
      addCategory(newCategory);
      setAllCategories([newCategory, ...allCategories]);
    },
    onError: (error) => {
      console.error('Category creation failed:', getErrorMessage(error));
    },
  });
};

/* -----------------------------
   🟠 Products
----------------------------- */
export const useGetProducts = (categoryId?: string, search?: string, page: number = 1, limit: number = 6) =>
  useQuery<ProductResponse>({
    queryKey: ['products', { categoryId, search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);

      return fetchJSON<ProductResponse>(`/api/catalogue/products?${params.toString()}`);
    },
    // 👇 Prevent any background fetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const useCreateProduct = () => {
  const catalogueProducts = useProductCatalogueStore((state) => state.catalogueProducts);
  const addedProductsToCatalogue = useProductCatalogueStore((state) => state.addedProductsToCatalogue);

  return useMutation({
    // 🟢 Send POST request to your backend
    mutationFn: async (payload: TCreateProductRequest) =>
      fetchJSON<{ product: TCreateProductRequest }>('/api/catalogue/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    // 🟢 On successful creation
    onSuccess: (response) => {
      const newProduct = response.product;

      // ✅ Update Zustand store immediately
      addedProductsToCatalogue([newProduct, ...catalogueProducts]);
    },

    // 🟠 Handle errors gracefully
    onError: (error) => {
      console.error('Product creation failed:', getErrorMessage(error));
    },
  });
};
