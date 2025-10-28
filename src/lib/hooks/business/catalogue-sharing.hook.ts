import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { $Enums, Prisma } from '@prisma/client';
import { z } from 'zod';
import { CategoryResponseSchema2, CreateCategorySchema } from '@/lib/schemas/business/server/catalogue.schema';
import { fetchJSON } from '@/utils/response';

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
  media?: { id: string; url: string }[];
  variants?: { id: string; name: string; price: number }[];
}

interface ProductResponse {
  products: IProductProps[];
  pagination: PaginationMeta;
}

export type TCreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type TCreateCategoryResponse = z.infer<typeof CategoryResponseSchema2>;

/* -----------------------------
   🟢 Categories
----------------------------- */
export const useGetCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchJSON<{ categories: { id: string; name: string }[] }>('/api/catalogue/categories'),
    // 👇 Prevent automatic refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity, // cache forever
    gcTime: Infinity, // (React Query v5) prevents garbage collection
  });

/* -----------------------------
   🟣 Create Category
----------------------------- */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateCategoryRequest) =>
      fetchJSON<TCreateCategoryResponse>('/api/catalogue/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    // ⚠️ Do NOT invalidate queries automatically — avoids unwanted refetches
    onSuccess: (data) => {
      console.log('✅ Category created:', data);

      // Manually update cached categories
      // Safely extract the category
      //const newCategory = data.category;
      queryClient.setQueryData<{ categories: { id: string; name: string }[] }>(['categories'], (oldData) =>
        oldData
          ? {
              ...oldData,
              categories: [...oldData.categories, { id: data.id, name: data.name }],
            }
          : { categories: [{ id: data.id, name: data.name }] }
      );
    },

    onError: (error) => {
      console.error('❌ Category creation failed:', error);
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
