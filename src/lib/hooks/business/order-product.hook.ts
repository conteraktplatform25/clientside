import {
  OrderListResponseSchema,
  OrderQuerySchema,
  OrderResponseSchema,
} from '@/lib/schemas/business/server/order.schema';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/utils/response';

export type TOrderQueryRequest = z.infer<typeof OrderQuerySchema>;
export type TOrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type TOrderResponse = z.infer<typeof OrderResponseSchema>;

export const useGetProductOrders = (params: TOrderQueryRequest) => {
  return useQuery({
    queryKey: ['get_orders', params],
    queryFn: async () => {
      const url = new URL('/api/orders', window.location.origin);
      url.searchParams.set('page', params.page.toString());
      url.searchParams.set('limit', params.limit.toString());
      if (params.search) url.searchParams.set('search', params.search);
      if (params.startDate) url.searchParams.set('startDate', params.startDate);
      if (params.endDate) url.searchParams.set('endDate', params.endDate);
      if (params.status) url.searchParams.set('status', params.status);

      return await fetchJSON<TOrderListResponse>(url.toString());
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
};
