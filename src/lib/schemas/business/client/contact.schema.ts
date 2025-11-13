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
