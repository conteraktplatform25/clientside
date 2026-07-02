'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { blurIn, fadeUp, popIn, slideLeft, slideRight } from '@/lib/animations.motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, List, Menu, Search, Settings2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const TopNavigationBusiness = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <motion.header
      className={`w-full bg-transparent shadow-none border-b border-gray-200/50 transition-all duration-300
            ${isSticky ? 'fixed top-0 left-0 z-50' : 'relative'}
          `}
      variants={blurIn}
      initial='hidden'
      animate='visible'
    >
      <div className='px-4 sm:px-6 lg:px-8 w-full lg:max-w-6xl mx-auto'>
        <div className='flex justify-between items-center h-16'>
          <motion.div
            animate={{ scale: isSearchFocused ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className='hidden lg:flex items-center relative'
          >
            <div className={`relative flex transition-all duration-300 ${isSearchFocused ? 'w-85' : 'w-71.75'}`}>
              <Input
                placeholder={'Search with business name'}
                className='w-full max-w-xl rounded-none rounded-l-lg border border-[#EFEFEF] bg-white focus:outline-none focus:ring-1 focus:ring-[#E63A24] focus:border-transparent transition-all duration-300'
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button className='bg-primary-600 text-white rounded-none rounded-r-sm border-none hover:bg-[#c42c18]'>
                <Search />
              </Button>
            </div>
          </motion.div>
          {/* General Desktop Navigation Links */}
          <motion.nav variants={popIn} initial='hidden' animate='visible' className='hidden md:flex items-center'>
            <div className='flex space-x-8'>
              <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                <Button variant='ghost' size='lg'>
                  <Bell width={28} height={28} />
                  <span className='sr-only'>Notification</span>
                </Button>
              </motion.div>
              <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                <Button variant='ghost' size='lg'>
                  <Settings2 width={28} height={28} />
                  <span className='sr-only'>Settings</span>
                </Button>
              </motion.div>
              <Separator orientation='vertical' className='border-2' />
              <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                <Button variant='ghost' size='lg'>
                  <List width={28} height={28} />
                  <span className='sr-only'>List</span>
                </Button>
              </motion.div>
            </div>
          </motion.nav>
          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className='w-6 h-6 text-gray-700' /> : <Menu className='w-6 h-6 text-gray-700' />}
          </button>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='md:hidden overflow-hidden'
            >
              <div className='py-4 space-y-4'>
                <div className='px-4'>
                  <div className={`relative flex transition-all duration-300 ${isSearchFocused ? 'w-85' : 'w-71.75'}`}>
                    <Input
                      type='text'
                      placeholder={'Search with business name...'}
                      className='w-full max-w-xl rounded-none rounded-l-lg border-1 border-[#EFEFEF] bg-white focus:outline-none focus:ring-1 focus:ring-[#E63A24] focus:border-transparent transition-all duration-300'
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                    <Button
                      onClick={() => alert('Successful Transaction')}
                      className='bg-[#E63A24] text-white rounded-none rounded-r-sm border-none hover:bg-[#c42c18]'
                    >
                      <Search />
                    </Button>
                  </div>
                </div>
                <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                  <Button variant='ghost' size='lg'>
                    <Bell width={28} height={28} />
                    <span className='sr-only'>Notification</span>
                  </Button>
                </motion.div>
                <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                  <Button variant='ghost' size='lg'>
                    <Settings2 width={28} height={28} />
                    <span className='sr-only'>Settings</span>
                  </Button>
                </motion.div>
                <Separator orientation='vertical' className='border-2' />
                <motion.div variants={slideRight} whileHover={{ y: -2 }}>
                  <Button variant='ghost' size='lg'>
                    <List width={28} height={28} />
                    <span className='sr-only'>List</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default TopNavigationBusiness;
