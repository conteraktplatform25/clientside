import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Image from 'next/image';

const growthData = [
  { week: 'Week 1', value: 0 },
  { week: 'Week 2', value: 25 },
  { week: 'Week 3', value: 70 },
  { week: 'Week 4', value: 28 },
  { week: 'Week 5', value: 45 },
  { week: 'Week 6', value: 20 },
];

const ApplicationChartDisplay = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <Card className='bg-gray-50 border border-[#EEEFF1] h-[440px]'>
          <CardHeader className='flex-col items-start'>
            <h4 className='font-semibold text-base text-gray-700'>Revenue Trend</h4>
          </CardHeader>
          <CardContent className='overflow-hidden pl-0'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={growthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#3b82f6' stopOpacity={0.3} />
                      <stop offset='100%' stopColor='#3b82f6' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='4 8' vertical={false} stroke='#e5e7eb' />
                  <XAxis dataKey='week' axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis
                    domain={[0, 'dataMax + 10']}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value?: number) => (value !== undefined ? `${value}%` : '')}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type='natural'
                    dataKey='value'
                    stroke='#2563eb'
                    strokeWidth={3}
                    fill='url(#revenueGradient)'
                    dot={false}
                    activeDot={{ r: 6 }}
                    isAnimationActive
                    animationDuration={700}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <Card className='bg-gray-50 border border-[#EEEFF1] h-[440px]'>
          <CardHeader className='flex-col items-start'>
            <h4 className='font-bold text-lg text-gray-800'>Recent activity</h4>
            <p className='text-sm leading-[155%] text-gray-500'>Latest registrations and updates</p>
          </CardHeader>
          <CardContent>
            <EmptyActivityLog />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const EmptyActivityLog = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[30vh] text-center bg-transparent relative'>
      <div className='flex flex-col items-center justify-center'>
        <Image
          src='/images/img-empty-data.png'
          alt='Empty catalogue'
          width={120}
          height={120}
          className='mb-4 opacity-80'
        />
        <p className='text-gray-500 text-base max-w-[180px]'>No customer activity for this period</p>
      </div>
    </div>
  );
};

export default ApplicationChartDisplay;
