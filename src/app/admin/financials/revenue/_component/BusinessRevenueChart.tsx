// src/app/admin/financials/revenue/_component/BusinessRevenueChart.tsx

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const growthData = [
  { week: 'Week 1', value: 25 },
  { week: 'Week 2', value: 22 },
  { week: 'Week 3', value: 36 },
  { week: 'Week 4', value: 32 },
];
const barData = [
  { week: 'Week 1', revenue: 120 },
  { week: 'Week 2', revenue: 180 },
  { week: 'Week 3', revenue: 140 },
  { week: 'Week 4', revenue: 220 },
];

const BusinessRevenueChart = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <Card className='bg-gray-50 border border-[#EEEFF1] h-[440px]'>
          <CardHeader className='flex-col items-start'>
            <h4 className='font-semibold text-base text-gray-700'>Revenue Breakdown</h4>
          </CardHeader>
          <CardContent className='overflow-hidden pl-0'>
            <div className='h-[352px] w-full'>
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
            <h4 className='font-semibold text-base text-gray-700'>Growth Trend</h4>
          </CardHeader>
          <CardContent className='pl-0'>
            <div className='h-[352px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='4 8' vertical={false} stroke='#e5e7eb' />
                  <XAxis dataKey='week' axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />

                  <Bar dataKey='revenue' fill='#3b82f6' radius={[0, 0, 0, 0]} barSize={68} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessRevenueChart;
