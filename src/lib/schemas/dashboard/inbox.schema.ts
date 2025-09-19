import { z } from 'zod';
import {
  ConstAssignee as assignees,
  ConstChatStatus as statuses,
  ConstTagLabels as labels,
  ConstInboxCategory as categories,
  ConstSorting as sorts,
} from '@/lib/constants/inbox.constant';

export const categoryFilterSchema = z.object({
  inbox_category: z.string().refine((value) => categories.includes(value)),
});

export const searchInputFilterSchema = z.object({
  search_user: z.string(),
});

export const selectFilterSchema = z.object({
  chat_status: z.string().refine((value) => statuses.includes(value)),
  tag_labels: z.string().refine((value) => labels.includes(value)),
  assignee: z.string().refine((value) => assignees.includes(value)),
  sort_order: z.string().refine((value) => sorts.includes(value)),
});

export type TCategoryFilterSchema = z.infer<typeof categoryFilterSchema>;
export type TSearchInputFilterSchema = z.infer<typeof searchInputFilterSchema>;
export type TSelectFilterSchema = z.infer<typeof selectFilterSchema>;
