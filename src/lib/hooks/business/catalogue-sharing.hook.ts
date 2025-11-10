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
  ProductDesktopResponseListSchema,
  //CategoryResponseListSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { fetchJSON } from '@/utils/response';
import { useCategoryCatalogueStore, useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

export type TCreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;
export type TUpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;
export type TCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCategoryResponseList = z.infer<typeof CategoryResponseListSchema>;
export type TCategoryDetailsResponse = z.infer<typeof CategoryDetailsResponseSchema>;

export type TCreateProductRequest = z.infer<typeof CreateProductSchema>;
export type TProductDestopResponse = z.infer<typeof ProductDesktopResponseListSchema>;

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
  const { addedCategories, setAllCategories, setCategoriesDropDown, clearAddedCategories, clearDropDownCategories } =
    useCategoryCatalogueStore();

  return useMutation({
    mutationFn: async (payload: TCreateCategoryRequest) =>
      fetchJSON<TCategoryResponseList>('/api/catalogue/categories/desktop', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (response) => {
      // ✅ Immediately update local Zustand store without refetch
      // Debug: Log the actual response
      // console.log('API Response:', response);
      clearAddedCategories();
      setAllCategories(response);

      clearDropDownCategories();
      const ddCategoryMapped = addedCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));
      setCategoriesDropDown(ddCategoryMapped);

      toast.success(`Category "${response[response.length - 1].name}" created successfully`);

      console.log('Category hook: ', response);
    },
    onError: (error) => {
      console.error('Category creation failed:', getErrorMessage(error));
    },
  });
};

/* ===========================================================================
   🟠 Products
============================================================================== */

/* -----------------------------
   🟠 Get all the Product base
   on the Desktop Model set
----------------------------- */
export const useGetDesktopProducts = () =>
  useQuery({
    queryKey: ['desktop_products'],
    queryFn: () =>
      fetchJSON<{
        products: TProductDestopResponse;
      }>('/api/catalogue/products/desktop'),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

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
  const clearDesktopProducts = useProductCatalogueStore((state) => state.clearDesktopProducts);
  const setDesktopProducts = useProductCatalogueStore((state) => state.setDesktopProducts);

  return useMutation({
    // 🟢 Send POST request to your backend
    mutationFn: async (payload: TCreateProductRequest) =>
      fetchJSON<{ products: TProductDestopResponse }>('/api/catalogue/products/desktop', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    // 🟢 On successful creation
    onSuccess: (response) => {
      const newProductList = response.products;
      // ✅ Update Zustand store immediately
      clearDesktopProducts();
      setDesktopProducts(newProductList);
      toast.success(`Product "${newProductList[0].name}" created successfully`);
    },

    // 🟠 Handle errors gracefully
    onError: (error) => {
      console.error('Product creation failed:', getErrorMessage(error));
    },
  });
};
