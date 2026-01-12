import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { PaymentStatus } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import { TFinancialTransactionResponse } from '@/lib/hooks/admin/financial-transactions.hook';
import { MockFinancialTransactions } from '@/lib/mock/financial-transaction.mock';

interface ITransactionDetailsDialogProps {
  transactionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionDetailsDialog = ({ transactionId, open, onOpenChange }: ITransactionDetailsDialogProps) => {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionProfile, setTransactionProfile] = useState<TFinancialTransactionResponse | null>(null);

  console.log(selectedPaymentStatus, showConfirm);
  useEffect(() => {
    if (!open || !transactionId) return;

    const transaction = MockFinancialTransactions.find((item) => item.id === transactionId);

    if (!transaction) {
      toast.error('Financial transaction not found');
      setTransactionProfile(null);
      return;
    }
    setTransactionProfile(transaction);
    setSelectedPaymentStatus(transaction.transaction_status);
  }, [transactionId, open]);

  /**
   * Reset dialog state when closed
   */
  useEffect(() => {
    if (!open) {
      setTransactionProfile(null);
      setSelectedPaymentStatus(null);
      setShowConfirm(false);
    }
  }, [open]);

  /** Allowed transitions */
  // const allowedTransitions = useMemo<PaymentStatus[]>(() => {
  //   if (!transactionProfile?.transaction_status) return [];
  //   return TRANSACTION_STATUS_FLOW[transactionProfile.transaction_status] ?? [];
  // }, [transactionProfile?.transaction_status]);

  /** Reset dialog */
  useEffect(() => {
    if (!open) {
      setSelectedPaymentStatus('PENDING');
      setShowConfirm(false);
    }
  }, [open]);
  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='p-0 overflow-hidden pb-8'>
          <DialogHeader className='p-4 border-b'>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='relative w-full px-4 my-4'
          >
            <div className='flex flex-col'>
              <div className='flex-1 space-y-2'>
                <section>
                  <div className='grid grid-cols-2 gap-y-4 text-base leading-[150%]'>
                    <span className='text-neutral-400'>Transaction date</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {formatDateField(transactionProfile?.created_at)}
                    </span>

                    <span className='text-neutral-400'>Transaction type</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {transactionProfile?.transaction_type}
                    </span>

                    <span className='text-neutral-400'>Payment Channel</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {transactionProfile?.payment_channel}
                    </span>
                  </div>
                  <Separator className='my-4' />
                  <div className='grid grid-cols-2 gap-y-4 text-base leading-[150%]'>
                    <span className='text-neutral-400'>Amount</span>
                    <span className='font-semibold flex item-end justify-end w-full'>{transactionProfile?.amount}</span>

                    <span className='text-neutral-400'>Transaction Fees</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {`₦${transactionProfile?.transaction_fee}`}
                    </span>

                    <span className='text-neutral-400'>Transaction ID</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {transactionProfile?.businessTransactionId}
                    </span>
                  </div>
                  <Separator className='my-4' />
                  <div className='grid grid-cols-2 gap-y-4 text-base leading-[150%]'>
                    <span className='text-neutral-400'>Recipient</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {transactionProfile?.paid_by}
                    </span>

                    <span className='text-neutral-400'>Business</span>
                    <span className='font-semibold flex item-end justify-end w-full'>
                      {transactionProfile?.business_name}
                    </span>

                    <span className='text-neutral-400'>Status</span>
                    <div className='flex item-end justify-end w-full'>
                      <div
                        className={`p-1 border border-[#EEEFF1] rounded-[4px] ${transactionProfile?.transaction_status === 'SUCCESS' ? 'bg-green-100' : transactionProfile?.transaction_status === 'FAILED' ? 'bg-red-100' : transactionProfile?.transaction_status === 'PENDING' ? 'bg-yellow-100' : 'bg-gray-100'}`}
                      >
                        <span
                          className={`font-medium text-sm leading-[155%] ${transactionProfile?.transaction_status === 'SUCCESS' ? 'text-green-700' : transactionProfile?.transaction_status === 'FAILED' ? 'text-red-700' : transactionProfile?.transaction_status === 'PENDING' ? 'text-yellow-700' : 'text-gray-700'}`}
                        >
                          {transactionProfile?.transaction_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default TransactionDetailsDialog;
