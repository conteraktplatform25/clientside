import z from 'zod';

export interface IContactTableHeaderProps {
  id: string;
  contact_name: string;
  phone_number: string;
  total_spent: string;
  last_orderId: string | null;
  tags: string | null;
  tag_number: string;
  tag_color: string;
  created_on?: Date | null;
}

export interface IGetDesktopContactsProps {
  search?: string;
  page?: number;
  limit?: number;
}

export const ClientCreateContactSchema = z.object({
  name: z.string().min(2),
  phone_number: z.string(),
  email: z.string().nullable().optional(),
  whatsapp_opt_in: z.boolean(),
  custom_fields: z
    .record(
      z.string(),
      z.object({
        type: z.enum(['text', 'number', 'date', 'boolean']),
        value: z.union([z.string(), z.number(), z.boolean()]),
      })
    )
    .optional(),
  source: z.string(),
});
export type TClientCreateContact = z.infer<typeof ClientCreateContactSchema>;

export interface IClientTag {
  id: string;
  name: string;
  color?: string;
}

export interface IContactTagEntry {
  id: string;
  tag: IClientTag;
}
