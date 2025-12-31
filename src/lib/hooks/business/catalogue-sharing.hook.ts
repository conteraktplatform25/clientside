import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { $Enums, Prisma, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import {
  CategoryDetailsResponseSchema,
  CategoryResponseSchema,
  CreateCategoryRequestSchema,
  UpdateCategoryRequestSchema,
  CreateProductSchema,
  CategoryResponseListSchema,
  ProductDesktopResponseListSchema,
  CreateMediaSchema,
  ProductResponseSchema,
  UpdateProductSchema,
  //CategoryResponseListSchema,
} from '@/lib/schemas/business/server/catalogue.schema';
import { fetchJSON, fetchMultipartJSON } from '@/utils/response';
import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

export type TCreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;
export type TUpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;
export type TCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCategoryResponseList = z.infer<typeof CategoryResponseListSchema>;
export type TCategoryDetailsResponse = z.infer<typeof CategoryDetailsResponseSchema>;

export type TCreateProductRequest = z.infer<typeof CreateProductSchema>;
export type TUpdateProduct = z.infer<typeof UpdateProductSchema>;
export type TProductDestopResponse = z.infer<typeof ProductDesktopResponseListSchema>;

export type TUploadedMedia = z.infer<typeof CreateMediaSchema>;
export type TProductResponse = z.infer<typeof ProductResponseSchema>;

/* -----------------------------
   🧱 Types
----------------------------- */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type TUpdateProductInput = {
  id: TUpdateProduct['id'];
  data: Partial<Pick<TUpdateProduct, 'name' | 'description' | 'price' | 'stock' | 'currency' | 'categoryId' | 'sku'>>;
};

const PRODUCTS_QUERY_KEY = ['products'] as const;

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
  //products: TCreateProductRequest[];
  products: TProductResponse[];
  pagination: PaginationMeta;
}

type PublishParams = {
  productId: TProductResponse['id'];
};

type PublishResponse = {
  id: TProductResponse['id'];
  status: ProductStatus;
};

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
    queryKey: [PRODUCTS_QUERY_KEY],
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
    queryKey: [PRODUCTS_QUERY_KEY, { categoryId, search, page, limit }],
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
  // const clearDesktopProducts = useProductCatalogueStore((state) => state.clearDesktopProducts);
  // const setDesktopProducts = useProductCatalogueStore((state) => state.setDesktopProducts);

  const queryClient = useQueryClient();

  return useMutation({
    // 🟢 Send POST request to your backend
    mutationFn: async (formData: FormData) =>
      fetchMultipartJSON<{ products: TProductDestopResponse }, FormData>('/api/catalogue/products/desktop', {
        method: 'POST',
        body: formData,
      }),

    // 🟢 On successful creation
    onSuccess: (response) => {
      const newProductList = response.products;
      // ✅ Update Zustand store immediately
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY],
      });
      toast.success(`Product "${newProductList[0].name}" created successfully`);
    },

    // 🟠 Handle errors gracefully
    onError: (error) => {
      console.error('Product creation failed:', getErrorMessage(error));
    },
  });
};

export const usePublishProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PublishResponse, // response
    Error, // error
    PublishParams, // variables
    { previous?: ProductResponse } // context
  >({
    mutationFn: ({ productId }) =>
      fetchJSON(`/api/catalogue/products/${productId}/publish`, {
        method: 'PATCH',
      }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });

      const previous = queryClient.getQueryData<ProductResponse>([PRODUCTS_QUERY_KEY]);

      queryClient.setQueryData<ProductResponse>([PRODUCTS_QUERY_KEY], (old) =>
        old
          ? {
              ...old,
              products: old.products.map((p) => (p.id === productId ? { ...p, status: ProductStatus.PUBLISHED } : p)),
            }
          : old
      );
      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData([PRODUCTS_QUERY_KEY], ctx.previous);
      }
      toast.error('Failed to publish product');
    },

    onSuccess: () => {
      toast.success('Product published successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

// export const usePublishProduct = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (productId: string) =>
//       fetchJSON(`/api/catalogue/products/${productId}/publish`, {
//         method: 'PATCH',
//       }),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY[0]] });
//       toast.success(`Product has been published.`);
//     },
//     // 🟠 Handle errors gracefully
//     onError: (error) => {
//       const errorMessage = getErrorMessage(error);
//       console.error('Product creation failed:', errorMessage);
//       toast.error(`Product publishing failed ${errorMessage}`);
//     },
//   });
// };

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<TProductResponse, Error, TUpdateProductInput, { previous?: TProductResponse }>({
    mutationFn: ({ id, data }) =>
      fetchJSON<TProductResponse>(`/api/catalogue/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      const previous = queryClient.getQueryData<TProductResponse>([PRODUCTS_QUERY_KEY]);

      queryClient.setQueryData<ProductResponse>([PRODUCTS_QUERY_KEY], (old) =>
        old
          ? {
              ...old,
              products: old.products.map((p) =>
                p.id === id
                  ? {
                      ...p,
                      name: data.name ?? p.name,
                      price: data.price ?? p.price,
                      description: data.description ?? p.description,
                      stock: data.stock ?? p.stock,
                      sku: data.sku ?? p.sku,
                    }
                  : p
              ),
            }
          : old
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, ctx.previous);
      }
      toast.error('Failed to update product');
    },

    onSuccess: () => {
      toast.success('Product updated');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
