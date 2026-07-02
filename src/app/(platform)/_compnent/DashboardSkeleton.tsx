'use client';

import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='h-16 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-between px-6'
      >
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />

          <div className='space-y-2'>
            <div className='w-40 h-4 bg-gray-200 rounded animate-pulse' />

            <div className='w-24 h-3 bg-gray-100 rounded animate-pulse' />
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />

          <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />
        </div>
      </motion.div>

      <div className='flex gap-6'>
        {/* Sidebar */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className='hidden lg:flex flex-col gap-4 w-72 bg-white rounded-2xl shadow-sm p-6 h-[80vh]'
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div key={index} className='h-12 bg-gray-100 rounded-xl animate-pulse' />
          ))}
        </motion.div>

        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          {/* Welcome Banner */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className='bg-white rounded-2xl shadow-sm p-8'
          >
            <div className='w-56 h-6 bg-gray-200 rounded animate-pulse mb-4' />

            <div className='w-96 h-4 bg-gray-100 rounded animate-pulse' />
          </motion.div>

          {/* Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                className='bg-white rounded-2xl shadow-sm p-6'
              >
                <div className='w-14 h-14 rounded-2xl bg-gray-100 animate-pulse mb-4' />

                <div className='w-24 h-4 bg-gray-200 rounded animate-pulse mb-3' />

                <div className='w-16 h-7 bg-gray-300 rounded animate-pulse' />
              </motion.div>
            ))}
          </div>

          {/* Table Skeleton */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className='bg-white rounded-2xl shadow-sm p-6'
          >
            <div className='w-48 h-5 bg-gray-200 rounded animate-pulse mb-6' />

            <div className='space-y-4'>
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div key={index} className='h-14 bg-gray-100 rounded-xl animate-pulse' />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
