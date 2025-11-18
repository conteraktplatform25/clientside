import { OrderListResponseSchema, OrderQuerySchema } from '@/lib/schemas/business/server/order.schema';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/utils/response';

export type TOrderQueryRequest = z.infer<typeof OrderQuerySchema>;
export type TOrderListResponse = z.infer<typeof OrderListResponseSchema>;

export const useGetProductOrders = (params: TOrderQueryRequest) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  useQuery({
    queryKey: ['get_orders', query.toString()],
    queryFn: async () => {
      const url = new URL('/api/orders', window.location.origin);
      url.searchParams.set('page', params.page.toString());
      url.searchParams.set('limit', params.limit.toString());
      if (params.search) url.searchParams.set('search', params.search);
      if (params.startDate) url.searchParams.set('startDate', params.startDate);
      if (params.endDate) url.searchParams.set('endDate', params.endDate);
      if (params.status) url.searchParams.set('status', params.status);

      const response = await fetchJSON<TOrderListResponse>(url.toString());

      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
};
