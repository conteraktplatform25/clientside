import { useMutation, useQuery } from '@tanstack/react-query';
import { $Enums, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  CategoryDetailsResponseSchema,
  CategoryResponseSchema,
  CreateCategoryRequestSchema,
  UpdateCategoryRequestSchema,
  CreateProductSchema,
  CategoryResponseListSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { fetchJSON } from '@/utils/response';
import { useCategoryCatalogueStore, useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { getErrorMessage } from '@/utils/errors';

export type TCreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;
export type TUpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;
export type TCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCategoryResponseList = z.infer<typeof CategoryResponseListSchema>;
export type TCategoryDetailsResponse = z.infer<typeof CategoryDetailsResponseSchema>;

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
    queryFn: () => fetchJSON<{ categories: TCategoryResponse[] }>('/api/catalogue/categories'),
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
        categories: TCategoryDetailsResponse[];
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
  const allCategories = useCategoryCatalogueStore((state) => state.addedCategories);

  return useMutation({
    mutationFn: async (payload: TCreateCategoryRequest) =>
      fetchJSON<{ category: TCategoryDetailsResponse }>('/api/catalogue/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (response) => {
      // ✅ Immediately update local Zustand store without refetch
      const categoryResponse: TCategoryResponse = {
        id: response.category.id,
        name: response.category.name,
        description: response.category.description || undefined,
      };
      addCategory(categoryResponse);
      setAllCategories([categoryResponse, ...allCategories]);
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
