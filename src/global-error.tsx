'use client';

import { Card, CardContent } from './components/ui/card';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.log(error);
  console.log(reset);
  return (
    <html>
      <body>
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4'>
          <Card className='max-w-md w-full rounded-2xl shadow-lg bg-orange-300'>
            <CardContent className='p-8 text-center'>
              <h1 className='text-4xl font-bold mb-4'>😒 Something went wrong!</h1>
              <p className='text-lg text-gray-700 mb-6'>
                What you were trying to do failed. Status of the issue has been sent to support!
              </p>
              <a
                href={'/login'}
                className=' text-white hover:text-gray-300 bg-gray-700 hover:bg-gray-900 p-2 rounded-lg transition-all duration-300 font-medium group'
              >
                <span>Back to Login Page</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
