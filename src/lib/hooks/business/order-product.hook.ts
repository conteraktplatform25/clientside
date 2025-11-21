import {
  OrderDetailsResponseSchema,
  OrderListResponseSchema,
  OrderQuerySchema,
  OrderResponseSchema,
  UpdateOrderStatusRequestSchema,
  UpdateOrderStatusResponseSchema,
} from '@/lib/schemas/business/server/order.schema';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from '@/utils/response';
import { OrderStatus } from '@prisma/client';

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
} as const;

export type TOrderQueryRequest = z.infer<typeof OrderQuerySchema>;
export type TOrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type TOrderResponse = z.infer<typeof OrderResponseSchema>;
export type TUpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;
export type TUpdateOrderStatusResponse = z.infer<typeof UpdateOrderStatusResponseSchema>;
export type TOrderDetails = z.infer<typeof OrderDetailsResponseSchema>;

/* -----------------------------
   🟠 GET ALL Client Order profile
   on the Model set
----------------------------- */
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

/* -----------------------------
   🟠 GET BY ID CLient Order profile
   on the Model set
----------------------------- */
export function useOrderDetails(orderId: string | null) {
  return useQuery({
    queryKey: ['order_details', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await fetchJSON<{ order_details: TOrderDetails }>(`/api/orders/${orderId}`);
      return res.order_details;
    },
    enabled: !!orderId,
    retry: 1,
  });
}

/* -----------------------------
   🟠 UPDATE transition Order STATUS
   on the Model set
----------------------------- */
type UpdateArgs = {
  orderId: string;
  data: TUpdateOrderStatusRequest;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: UpdateArgs) => {
      return await fetchJSON(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    onMutate: async ({ orderId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['get_orders'] });
      await queryClient.cancelQueries({ queryKey: ['order_details', orderId] });

      const previousOrderList = queryClient.getQueryData<TOrderListResponse>(['get_orders']);
      const previousOrderDetails = queryClient.getQueryData<TOrderResponse>(['order_details', orderId]);

      if (previousOrderList) {
        queryClient.setQueryData<TOrderListResponse>(['get_orders'], {
          ...previousOrderList,
          orders: previousOrderList.orders.map((order) =>
            order.id === orderId ? { ...order, status: data.status } : order
          ),
        });
      }

      if (previousOrderDetails) {
        queryClient.setQueryData(['order_details', orderId], {
          ...previousOrderDetails,
          status: data.status,
        });
      }

      return { previousOrderList, previousOrderDetails };
    },

    onError: (_error, args, ctx) => {
      if (ctx?.previousOrderList) queryClient.setQueryData(['get_orders'], ctx.previousOrderList);

      if (ctx?.previousOrderDetails)
        queryClient.setQueryData(['order_details', args.orderId], ctx.previousOrderDetails);
    },

    onSettled: (_res, _err, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['get_orders'] });
      queryClient.invalidateQueries({ queryKey: ['order_details', orderId] });
    },
  });
};
