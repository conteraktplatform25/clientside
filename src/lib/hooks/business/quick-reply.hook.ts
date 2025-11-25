import {
  CreateQuickReplyRequestSchema,
  CreateQuickReplyResponseSchema,
  QuickReplyDetailsResponseSchema,
  QuickReplyListResponseSchema,
  QuickReplyQuerySchema,
  QuickReplyResponseSchema,
  UpdateQuickReplyRequestSchema,
  UpdateQuickReplyResponseSchema,
} from '@/lib/schemas/business/server/quickReply.schema';
import { fetchJSON } from '@/utils/response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

export type TQuickReplyQuery = z.infer<typeof QuickReplyQuerySchema>;
export type TQuickReplyListResponse = z.infer<typeof QuickReplyListResponseSchema>;
export type TQuickReplyDetailsResponse = z.infer<typeof QuickReplyDetailsResponseSchema>;
export type TUpdateQuickReplyRequest = z.infer<typeof UpdateQuickReplyRequestSchema>;
export type TUpdateQuickReplyResponse = z.infer<typeof UpdateQuickReplyResponseSchema>;
export type TCreateQuickReplyRequest = z.infer<typeof CreateQuickReplyRequestSchema>;
export type TCreateQuickReplyResponse = z.infer<typeof CreateQuickReplyResponseSchema>;
export type TQuickReplyResponse = z.infer<typeof QuickReplyResponseSchema>;

/* -----------------------------
   🟠 GET ALL Quick reply profile
   on the Model set
----------------------------- */
export const useGetQuickReplies = (params: TQuickReplyQuery) => {
  return useQuery({
    queryKey: ['get_quick_replies', params],
    queryFn: async () => {
      const url = new URL('/api/quick-replies', window.location.origin);
      url.searchParams.set('page', params.page.toString());
      url.searchParams.set('limit', params.limit.toString());
      if (params.search) url.searchParams.set('search', params.search);
      if (params.category) url.searchParams.set('category', params.category);

      return await fetchJSON<TQuickReplyListResponse>(url.toString());
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: Infinity,
  });
};

/* -----------------------------
   🟠 GET BY ID Quick Reply profile
   on the Model set
----------------------------- */
export function useQuickReplyDetails(quickReplyId: string | null) {
  return useQuery({
    queryKey: ['quick_reply_details', quickReplyId],
    queryFn: async () => {
      if (!quickReplyId) return null;
      const res = await fetchJSON<{ quick_reply: TQuickReplyDetailsResponse }>(`/api/quick-replies/${quickReplyId}`);
      return res.quick_reply;
    },
    enabled: !!quickReplyId,
    retry: 1,
  });
}

/* -----------------------------
   🟠 Create Quick reply profile
   on the Model set
----------------------------- */
export const useCreateQuickReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateQuickReplyRequest) => {
      return await fetchJSON<TCreateQuickReplyResponse>('/api/quick-replies', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /* -----------------------------------------⭐ OPTIMISTIC UPDATE ------------------------------------------ */
    onMutate: async (newReply) => {
      await queryClient.cancelQueries({ queryKey: ['get_quick_replies'] });

      const previousQuickReplyList = queryClient.getQueryData<TQuickReplyListResponse>(['get_quick_replies']);

      if (previousQuickReplyList) {
        const optimisticId = `temp-${Date.now()}`;

        queryClient.setQueryData(['get_quick_replies'], {
          ...previousQuickReplyList,
          replies: [
            {
              id: optimisticId,
              title: newReply.title,
              content: newReply.content,
              created_at: new Date(),
              category: newReply.category,
              is_global: newReply.is_global,
            },
            ...previousQuickReplyList.replies,
          ],
          total: previousQuickReplyList.pagination.total + 1,
        });
      }
      return { previousQuickReplyList };
    },

    /* ----------------------------------------- ❌ ROLLBACK ON ERROR ------------------------------------------ */
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousQuickReplyList) {
        queryClient.setQueryData(['get_quick_replies'], ctx.previousQuickReplyList);
      }
    },

    /* ----------------------------------------- 🔄 REFETCH AFTER SETTLED ------------------------------------------ */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['get_quick_replies'] });
      toast.success(`Reply message has been created successfully`);
    },
  });
};

/* -----------------------------
   🟠 UPDATE Quick reply profile
   on the Model set
----------------------------- */
type TUpdateQuickReplyArgs = {
  quickReplyId: string;
  data: TUpdateQuickReplyRequest;
};

export const useUpdateQuickReply = (quickReplyId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: TUpdateQuickReplyArgs) => {
      return await fetchJSON(`/api/quick-replies/${quickReplyId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    onMutate: async ({ quickReplyId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['get_quick_replies'] });
      await queryClient.cancelQueries({ queryKey: ['quick_reply_details', quickReplyId] });

      const previousQuickReplyList = queryClient.getQueryData<TQuickReplyListResponse>(['get_quick_replies']);
      const previousQuickReplyDetails = queryClient.getQueryData<TQuickReplyDetailsResponse>([
        'quick_reply_details',
        quickReplyId,
      ]);

      if (previousQuickReplyList) {
        queryClient.setQueryData<TQuickReplyListResponse>(['get_quick_replies'], {
          ...previousQuickReplyList,
          replies: previousQuickReplyList.replies.map((reply) =>
            reply.id === quickReplyId
              ? {
                  ...reply, // preserves isActive, created_at, variables, createdById, etc.
                  ...data, // only merges fields that exist on the reply type
                }
              : reply
          ),
        });
      }

      if (previousQuickReplyDetails) {
        queryClient.setQueryData(['quick_reply_details', quickReplyId], {
          ...previousQuickReplyDetails,
        });
      }

      return { previousQuickReplyList, previousQuickReplyDetails };
    },

    onError: (_error, args, ctx) => {
      if (ctx?.previousQuickReplyList) queryClient.setQueryData(['get_quick_replies'], ctx.previousQuickReplyList);

      if (ctx?.previousQuickReplyDetails)
        queryClient.setQueryData(['quick_reply_details', args.quickReplyId], ctx.previousQuickReplyDetails);
    },

    onSettled: (_res, _err, { quickReplyId }) => {
      queryClient.invalidateQueries({ queryKey: ['get_quick_replies'] });
      queryClient.invalidateQueries({ queryKey: ['quick_reply_details', quickReplyId] });
    },
  });
};
