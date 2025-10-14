import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
// import { Order, OrderStatus } from "./OrdersTable";
// import StatusBadge from "./StatusBadge";
import { IOrderProps, OrderStatus } from '@/type/client/business/order.type';
import StatusBadge from './_component/StatusBadge';
import { Label } from '@/components/ui/label';

interface OrderDetailsDialogProps {
  order: IOrderProps | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, isOpen, onClose, onStatusChange }) => {
  if (!order) {
    return null;
  }

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    onStatusChange(order.id, newStatus);
  };

  const totalItemsAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='right' className='w-full sm:max-w-lg flex flex-col'>
        <SheetHeader>
          {/* <SheetTitle>Order Details - #{order.orderId}</SheetTitle> */}
          <SheetTitle>
            <Label className='font-medium text-base leading-[150%] text-neutral-700'>
              Order Details - #{order.orderId}
            </Label>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className='flex-1 overflow-y-auto px-4 py-2 space-y-6'>
          {/* Customer Information */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Customer information</h3>
            <div className='grid grid-cols-2 gap-y-2 text-sm'>
              <span className='text-muted-foreground'>Name</span>
              <span className='text-right font-medium'>{order.customer}</span>

              <span className='text-muted-foreground'>Email</span>
              <span className='text-right font-medium'>{order.customerEmail}</span>

              <span className='text-muted-foreground'>Phone number</span>
              <span className='text-right font-medium'>{order.customerPhone}</span>

              <span className='text-muted-foreground'>Address</span>
              <span className='text-right font-medium'>{order.customerAddress}</span>
            </div>
          </div>
          <Separator />

          {/* Order Information */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Order information</h3>
            <div className='grid grid-cols-2 gap-y-2 text-sm'>
              <span className='text-muted-foreground'>Order ID</span>
              <span className='text-right font-medium'>#{order.orderId}</span>

              <span className='text-muted-foreground'>Order date</span>
              <span className='text-right font-medium'>{order.orderDate}</span>

              <span className='text-muted-foreground'>Order status</span>
              <div className='flex justify-end'>
                <StatusBadge status={order.status} onStatusChange={handleStatusUpdate} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Order items</h3>
            <div className='space-y-2'>
              {order.items.map((item, index) => (
                <div key={index} className='flex justify-between items-center p-3 bg-gray-50 rounded-md text-sm'>
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className='font-medium'>₦{(item.price * item.quantity).toLocaleString('en-NG')}</span>
                </div>
              ))}
              <div className='flex justify-between items-center p-3 bg-gray-100 rounded-md text-base font-bold'>
                <span>Total</span>
                <span>₦{totalItemsAmount.toLocaleString('en-NG')}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsDialog;
