import { DateRangePickerPremium } from '@/components/custom/DateRangePickerPremium';
import React, { useState } from 'react';
import ApplicationStatisticsCard, { IApplicationStatisticsCardProps } from './ApplicationStatisticsCard';
import { motion, Variants } from 'framer-motion';
import ApplicationChartDisplay from './ApplicationChartDisplay';

const ContaktAdminDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const applicationStats: IApplicationStatisticsCardProps[] = [
    {
      title: 'Total businesses',
      value: '100',
      icon: 'total',
    },
    {
      title: 'Active businesses',
      value: '80',
      icon: 'active',
    },
    {
      title: 'Revenue',
      value: '3,107,000',
      icon: 'revenue',
    },
  ];

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
        <h6 className='font-semibold text-xl leading-[150%] text-neutral-800'>Overview of business performance</h6>
        <div className='flex items-end justify-end'>
          <DateRangePickerPremium value={dateRange} onChange={setDateRange} />
        </div>
      </div>
      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        {applicationStats.map((stat, _idx) => (
          <motion.div key={_idx} variants={item}>
            <ApplicationStatisticsCard title={stat.title} value={stat.value} icon={stat.icon} />
          </motion.div>
        ))}
      </motion.div>
      <div>
        <ApplicationChartDisplay />
      </div>
    </div>
  );
};

export default ContaktAdminDashboard;
