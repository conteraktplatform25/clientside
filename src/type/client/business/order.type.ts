export type OrderStatus = 'Delivered' | 'Pending' | 'Ongoing' | 'Cancelled';
export type OrderStatusFilter = 'All orders' | 'Delivered' | 'Pending' | 'Ongoing' | 'Cancelled';

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
}
export interface IOrderProps {
  id: string;
  orderId: string;
  amount: number;
  dateTime: string;
  quantity: number;
  customer: string; // Customer Name
  status: OrderStatus;
  // New fields for detailed view
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderDate: string; // This can be derived from dateTime or stored separately
  items: IOrderItem[];
}
