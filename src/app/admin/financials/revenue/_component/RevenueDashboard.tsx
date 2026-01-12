'use client';
import { DateRangePickerPremium } from '@/components/custom/DateRangePickerPremium';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import RevenueSummaryCard, { IRevenueSummaryCardProps } from './RevenueSummaryCard';
import BusinessRevenueChart from './BusinessRevenueChart';

const revenueSummaryStats: IRevenueSummaryCardProps[] = [
  {
    title: 'Total Revenue',
    value: '₦2,500,000',
    icon: 'revenue',
  },
  {
    title: 'Net profit',
    value: '₦2,100,000',
    icon: 'profit',
  },
] as const;

const RevenueDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring', // ✅ now correctly typed
      },
    },
  };
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex justify-between items-start'>
        <h6 className='font-semibold text-xl leading-[150%] text-neutral-800'>Revenue Dashboard</h6>
        <div className='flex items-end justify-end gap-3'>
          <Button variant='default' className='bg-white border hover:bg-gray-100 rounded-md'>
            <FileUp size={12} color='#1A73E8' />
            <span className='ml-2 text-sm text-neutral-800'>Export</span>
          </Button>
          <DateRangePickerPremium value={dateRange} onChange={setDateRange} />
        </div>
      </div>
      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'
      >
        {revenueSummaryStats.map((stat, _idx) => (
          <motion.div key={_idx} variants={item}>
            <RevenueSummaryCard title={stat.title} value={stat.value} icon={stat.icon} />
          </motion.div>
        ))}
      </motion.div>
      <div className='mt-2 mb-8'>
        <BusinessRevenueChart />
      </div>
    </div>
  );
};

export default RevenueDashboard;
