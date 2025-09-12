'use client';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  //const router = useRouter();

  // const handleHomeLink = () => {
  //   router.push('/');
  // };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4'>
      <Card className='max-w-lg w-full rounded-2xl shadow-lg bg-primary-300'>
        <CardContent className='p-8 text-center'>
          <h1 className='text-4xl font-bold mb-4 text-yellow-800'>🚧 Under Development</h1>
          <p className='text-lg text-gray-700 mb-6'>
            The page you{"'"}re looking for is still on the pipeline. We{"'"}re currently working on it!
          </p>
          <a
            href={'/'}
            className=' bg-primary-700 hover:bg-primary-900 text-neutral-100 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 font-medium group'
          >
            <span>Back to Home Page</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
