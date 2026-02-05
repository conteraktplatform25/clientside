interface IPermissionAccess {
  group_name: string;
  name: string;
}

export const data_permission_access: IPermissionAccess[] = [
  {
    group_name: 'inbox',
    name: 'view_message',
  },
  {
    group_name: 'inbox',
    name: 'assigned_all',
  },
  {
    group_name: 'inbox',
    name: 'assigned_me',
  },

  {
    group_name: 'contact',
    name: 'view_contact',
  },
  {
    group_name: 'contact',
    name: 'add_contact',
  },
  {
    group_name: 'contact',
    name: 'export_contact',
  },
  {
    group_name: 'contact',
    name: 'view_details_contact',
  },
  {
    group_name: 'contact',
    name: 'add_tags',
  },
  {
    group_name: 'contact',
    name: 'delete_contact',
  },
  {
    group_name: 'contact',
    name: 'send_message',
  },
  {
    group_name: 'catalogue',
    name: 'view_products',
  },
  {
    group_name: 'catalogue',
    name: 'add_category',
  },
  {
    group_name: 'catalogue',
    name: 'view_category',
  },
  {
    group_name: 'catalogue',
    name: 'add_product',
  },
  {
    group_name: 'catalogue',
    name: 'publish_product',
  },
  {
    group_name: 'catalogue',
    name: 'delete_product',
  },
  {
    group_name: 'catalogue',
    name: 'view_details_product',
  },
  {
    group_name: 'catalogue',
    name: 'edit_product',
  },
  {
    group_name: 'orders',
    name: 'view_orders',
  },
  {
    group_name: 'orders',
    name: 'view_cards',
  },
  {
    group_name: 'orders',
    name: 'view_details_order',
  },
  {
    group_name: 'orders',
    name: 'change_order_transition',
  },
  {
    group_name: 'orders',
    name: 'update_order',
  },
  {
    group_name: 'replies',
    name: 'view_replies',
  },
  {
    group_name: 'replies',
    name: 'add_reply',
  },
  {
    group_name: 'replies',
    name: 'edit_reply',
  },
  {
    group_name: 'replies',
    name: 'delete_reply',
  },
  {
    group_name: 'team',
    name: 'view_team',
  },
  {
    group_name: 'team',
    name: 'invite_teammember',
  },
  {
    group_name: 'team',
    name: 'view_invited_members',
  },
  {
    group_name: 'team',
    name: 'update_member',
  },
  {
    group_name: 'team',
    name: 'deactivate_member',
  },
];
