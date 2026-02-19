'use client';

import { useOrderDetails, useUpdateOrderStatus } from '@/lib/hooks/business/order-product.hook';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { Separator } from '@/components/ui/separator';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { CurrencyType, OrderStatus } from '@prisma/client';
import { ORDER_STATUS_FLOW } from '@/lib/hooks/business/order-product.hook';
import { toast } from 'sonner';
import { getCurrencySymbol } from '@/lib/helpers/string-manipulator.helper';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getErrorMessage } from '@/utils/errors';

interface IOrderDetailsDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDetailsTestDialog({ orderId, open, onOpenChange }: IOrderDetailsDialogProps) {
  const { data, isLoading, isError } = useOrderDetails(orderId);

  const mutation = useUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /** Allowed transitions */
  const allowedTransitions = useMemo<OrderStatus[]>(() => {
    if (!data?.status) return [];
    return ORDER_STATUS_FLOW[data.status] ?? [];
  }, [data?.status]);

  /** Reset dialog */
  useEffect(() => {
    if (!open) {
      setSelectedStatus(null);
      setShowConfirm(false);
    }
  }, [open]);

  /** Perform status change */
  const onDoStatusChange = async () => {
    if (!orderId || !selectedStatus) return;

    try {
      await mutation.mutateAsync({
        orderId,
        data: { status: selectedStatus },
      });

      toast.success(`Order status updated to ${selectedStatus}`);
      setShowConfirm(false);
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message || 'Failed to update order status');
    }
  };

  return (
    <AnimatePresence>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='right' className='w-full sm:max-w-3xl flex flex-col'>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <SheetHeader>
              <SheetTitle className='text-xl'>Order Details</SheetTitle>
              <SheetDescription>Full summary of the selected order</SheetDescription>
            </SheetHeader>

            <Separator />

            <ScrollArea className='h-[400px]'>
              {/* Status Controls */}
              <div className='flex items-center justify-between gap-4 p-4'>
                <div className='flex items-center gap-4'>
                  <span className='text-neutral-600'>Change order status</span>

                  <Select value={selectedStatus ?? ''} onValueChange={(val) => setSelectedStatus(val as OrderStatus)}>
                    <SelectTrigger className='h-8 w-44'>
                      <SelectValue placeholder={data?.status ?? 'Select'} />
                    </SelectTrigger>

                    <SelectContent>
                      {allowedTransitions.length === 0 && data?.status ? (
                        <SelectItem value={data?.status ?? ''} disabled>
                          No transitions available
                        </SelectItem>
                      ) : (
                        allowedTransitions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size='sm'
                  onClick={() => {
                    if (!selectedStatus) return toast.info('Please select a status');
                    setShowConfirm(true);
                  }}
                  className='bg-primary-base hover:bg-primary-700'
                  disabled={
                    //!selectedStatus ||
                    selectedStatus === data?.status || selectedStatus === 'DELIVERED' || mutation.isPending
                  }
                >
                  {mutation.isPending ? 'Updating…' : 'Update'}
                </Button>
              </div>

              {/* Loading */}
              {isLoading && <UILoaderIndicator label='Loading order details…' />}

              {/* Error */}
              {isError && <p className='text-red-600 p-4'>Failed to load order details.</p>}

              {/* Loaded UI */}
              {!isLoading && data && (
                <div className='flex flex-col lg:flex-row gap-3 p-4'>
                  {/* Left column */}
                  <div className='flex-1 space-y-2'>
                    <section>
                      <h3 className='text-lg font-semibold mb-2'>Customer information</h3>
                      <div className='grid grid-cols-2 gap-y-2 text-sm'>
                        <span className='text-muted-foreground'>Name</span>
                        <span className='font-medium'>{data.contact.name}</span>

                        <span className='text-muted-foreground'>Phone</span>
                        <span className='font-medium'>{data.contact.phone_number}</span>

                        <span className='text-muted-foreground'>Email</span>
                        <span className='font-medium'>{data.contact.email ? data.contact.email : 'NOT AVAILABLE'}</span>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h3 className='text-lg font-semibold mb-2'>Order information</h3>
                      <div className='grid grid-cols-2 gap-y-2 text-sm'>
                        <span className='text-muted-foreground'>Order ID</span>
                        <span className='font-medium'>{data.order_number}</span>

                        <span className='text-muted-foreground'>Order date</span>
                        <span className='font-medium'>{formatDateField(data.created_at.toLocaleString())}</span>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h3 className='text-lg font-semibold mb-2'>Delivery info</h3>
                      <div className='grid grid-cols-2 gap-y-2 text-sm'>
                        <span className='text-muted-foreground'>Address</span>
                        <span className='font-medium'>
                          {data.delivery_address ? JSON.stringify(data.delivery_address) : 'NOT AVAILABLE'}
                        </span>

                        <span className='text-muted-foreground'>Notes</span>
                        <span className='font-medium'>{data.notes ? data.notes : 'NOT AVAILABLE'}</span>
                      </div>
                    </section>
                  </div>

                  {/* Order Items */}
                  <div className='lg:w-1/2 bg-white border rounded-xl p-4 shadow-sm'>
                    <ScrollArea className='h-64 w-full'>
                      <div className='flex flex-col gap-2'>
                        <h3 className='text-lg font-semibold'>Order items</h3>
                        <div className='space-y-2'>
                          {data.OrderItem.map((item) => (
                            <div
                              key={item.name}
                              className='flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md'
                            >
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span className='font-semibold'>
                                ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                              </span>
                            </div>
                          ))}

                          <div className='flex items-center justify-between text-base font-bold p-3 bg-gray-100 rounded-md mt-4'>
                            <span>Total</span>
                            <span>
                              {getCurrencySymbol(data.currency as CurrencyType)}
                              {data.total_amount.toLocaleString('en-NG')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Footer */}
              {/* <div className='flex justify-end p-4 border-t'>
                <Button variant='ghost' onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div> */}

              {/* Confirm Modal */}
              <AnimatePresence>
                {showConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.18 }}
                    className='fixed inset-0 z-50 flex items-center justify-center'
                  >
                    <div className='absolute inset-0 bg-black/40' onClick={() => setShowConfirm(false)} />

                    <div className='relative bg-white w-[380px] p-5 rounded-xl shadow-xl z-10'>
                      <h3 className='text-lg font-semibold'>Confirm status change</h3>
                      <p className='text-sm text-muted-foreground mt-2'>
                        Change status to <strong>{selectedStatus}</strong>?
                      </p>

                      <div className='flex justify-end gap-2 mt-4'>
                        <Button variant='ghost' onClick={() => setShowConfirm(false)}>
                          Cancel
                        </Button>

                        <Button onClick={onDoStatusChange} disabled={mutation.isPending}>
                          {mutation.isPending ? 'Updating…' : 'Confirm'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        </SheetContent>
      </Sheet>
    </AnimatePresence>
  );
}
