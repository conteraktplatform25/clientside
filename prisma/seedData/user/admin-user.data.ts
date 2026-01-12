interface ISuperAdminUserProps {
  email: string;
  phone?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}
export const super_admin_users: ISuperAdminUserProps[] = [
  {
    email: 'samuel.esezobor076@gmail.com',
    phone: '2347038954801',
    first_name: 'Samuel',
    last_name: 'Esezobor',
    password: 'contaktplatform123456789',
  },
];
