import Image from 'next/image';
import React from 'react';

const ConcaktDescription = () => {
  return (
    <section className='hidden md:flex flex-1 bg-primary-900 text-white flex-col item-center justify-end text-center p-1 overflow-hidden'>
      {/* Spacer to push content towards the center/bottom */}
      <div className='flex-grow'></div>
      {/* Central images section */}
      <div className='mb-16 relative flex justify-center items-center mt-8 w-full'>
        {/* Card 1 (background) */}
        <div className='relative w-[min(84vw,480px)] h-[min(52vh,380px)] bg-white rounded-[7.66px] transform origin-center'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Image src={'/images/img_auth_1.png'} alt='Analytics' fill />
          </div>
        </div>
        {/* Card 2 (foreground, overlapping) */}
        <div className='absolute w-[min(55vw,325px)] h-[min(35vh,280px)] bg-white rounded-[9.46px] transform origin-center translate-x-[min(30vw,140px)] translate-y-[min(20vw,110px)]'>
          <div className='absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold p-4'>
            <Image src={'/images/img_auth_2.png'} alt='Analytics' fill />
            {/* <div className='w-full h-full bg-gray-50 rounded-lg flex items-center justify-center text-sm text-gray-500'>
              Dashboard Preview 2
            </div> */}
          </div>
        </div>
      </div>
      <div className='mb-8 w-full max-w-[58%] mx-auto'>
        <h3 className='font-bold text-white mb-2'>Grow Your Business on Whatsapp</h3>
        <p className='text-gray-300 max-w-md mx-auto text-center'>
          Sign up to Contakt universe and accelerate the speed in which you do business.
        </p>
      </div>
    </section>
  );
};

export default ConcaktDescription;
