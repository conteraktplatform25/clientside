import { Card, CardContent } from '@/components/ui/card';

// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4'>
        <Card className='max-w-lg w-full rounded-2xl shadow-lg bg-primary-300'>
          <CardContent className='p-8 text-center'>
            <h1 className='text-4xl mb-4 font-bold text-red-600'>
              🚫 Access Denied – You don’t have permission to view this page
            </h1>

            <a
              href={'/'}
              className=' bg-primary-700 hover:bg-primary-900 text-neutral-100 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 font-medium group'
            >
              <span>Back to Home Page</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
