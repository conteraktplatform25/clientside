export interface IUserProfileTableHeaderProps {
  id?: string;
  email: string;
  email_verified_date: string;
  phone_number?: string;
  full_name?: string;
  image?: string;
  is_activated?: boolean;
  created_by?: string;
  created_date?: Date;
}
