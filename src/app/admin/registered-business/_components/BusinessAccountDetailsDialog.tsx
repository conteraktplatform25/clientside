import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TBusinessAccountResponse } from '@/lib/hooks/admin/registered-business.hook';
import { ACCOUNT_STATUS_FLOW, MockBusinessAccounts } from '@/lib/mock/business-account.mock';
import { BusinessAccountStatus } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';

interface IBusinessAccountDetailsDialogProps {
  accountId: string | null;
  open: boolean;
  //onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

const BusinessAccountDetailsDialog = ({ accountId, open, onOpenChange }: IBusinessAccountDetailsDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<BusinessAccountStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountProfile, setAccountProfile] = useState<TBusinessAccountResponse | null>(null);

  console.log(showConfirm);

  useEffect(() => {
    if (!open || !accountId) return;

    const account = MockBusinessAccounts.find((item) => item.id === accountId);

    if (!account) {
      toast.error('Business account not found');
      setAccountProfile(null);
      return;
    }
    setAccountProfile(account);
    setSelectedStatus(account.account_status);
  }, [accountId, open]);

  /**
   * Reset dialog state when closed
   */
  useEffect(() => {
    if (!open) {
      setAccountProfile(null);
      setSelectedStatus(null);
      setShowConfirm(false);
    }
  }, [open]);

  /** Allowed transitions */
  const allowedTransitions = useMemo<BusinessAccountStatus[]>(() => {
    if (!accountProfile?.account_status) return [];
    return ACCOUNT_STATUS_FLOW[accountProfile.account_status] ?? [];
  }, [accountProfile?.account_status]);

  /** Reset dialog */
  useEffect(() => {
    if (!open) {
      setSelectedStatus('INACTIVE');
      setShowConfirm(false);
    }
  }, [open]);
  return (
    <AnimatePresence>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='p-0 overflow-hidden pb-8'>
          <DialogHeader className='p-4 border-b'>
            <DialogTitle>Business Details</DialogTitle>
          </DialogHeader>
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='relative w-full px-4'
          >
            <div className='flex flex-col gap-4'>
              <div className='flex items-start gap-4 px-2'>
                <div className='flex flex-1 min-w-0 items-start gap-2'>
                  <span className='text-neutral-800 text-xl leading-[150%] font-semibold'>
                    {accountProfile?.business_name}
                  </span>
                  <div
                    className={`p-2 border border-[#EEEFF1] rounded-[8px] ${accountProfile?.account_status === 'ACTIVE' ? 'bg-green-100' : accountProfile?.account_status === 'INACTIVE' ? 'bg-gray-100' : 'bg-red-100'}`}
                  >
                    <span
                      className={`font-medium text-sm leading-[155%] ${accountProfile?.account_status === 'ACTIVE' ? 'text-green-700' : accountProfile?.account_status === 'INACTIVE' ? 'text-gray-700' : 'text-red-700'}`}
                    >
                      {accountProfile?.account_status}
                    </span>
                  </div>
                </div>
                <div className='flex-none flex justify-end'>
                  <div className='flex gap-1'>
                    <Select
                      value={selectedStatus ?? 'Quick actions'}
                      onValueChange={(val) => setSelectedStatus(val as BusinessAccountStatus)}
                    >
                      <SelectTrigger className=' w-[140px]'>
                        <SelectValue placeholder={accountProfile?.account_status ?? 'Select'} />
                      </SelectTrigger>

                      <SelectContent>
                        {allowedTransitions.length === 0 && accountProfile?.account_status ? (
                          <SelectItem value={accountProfile?.account_status ?? ''} disabled>
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
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
                <Card className='w-full max-w-xl'>
                  <CardContent>
                    <div className='flex flex-col gap-2'>
                      <Label className='text-base leading-[150%] font-medium text-neutral-base'>
                        {'Total revenue'}
                      </Label>
                      <div className='text-[24px] leading-[140%] text-[#2C2C2C] font-semibold'>
                        {accountProfile?.total_revenue}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className='w-full max-w-xl'>
                  <CardContent>
                    <div className='flex flex-col gap-2'>
                      <Label className='text-base leading-[150%] font-medium text-neutral-base'>
                        {'Total Customers'}
                      </Label>
                      <div className='text-[24px] leading-[140%] text-[#2C2C2C] font-semibold'>
                        {accountProfile?.total_customers}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='flex flex-col lg:flex-row gap-3 p-3 border border-[#EEEFF1] rounded-[10px]'>
                <div className='flex-1 space-y-2'>
                  <section>
                    <h3 className='text-lg font-semibold mb-2'>Business information</h3>
                    <div className='grid grid-cols-2 gap-y-2 text-base leading-[150%]'>
                      <span className='text-neutral-400'>Email</span>
                      <span className='font-semibold flex item-end justify-end w-full'>
                        {accountProfile?.contact_email}
                      </span>

                      <span className='text-neutral-400'>Phone Number</span>
                      <span className='font-semibold flex item-end justify-end w-full'>
                        {accountProfile?.contact_phone_number}
                      </span>

                      <span className='text-neutral-400'>Registration Date</span>
                      <span className='font-semibold flex item-end justify-end w-full'>
                        {formatDateField(accountProfile?.created_at)}
                      </span>

                      <span className='text-neutral-400'>Last login</span>
                      <span className='font-semibold flex item-end justify-end w-full'>
                        {formatDateField(accountProfile?.last_login)}
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default BusinessAccountDetailsDialog;
