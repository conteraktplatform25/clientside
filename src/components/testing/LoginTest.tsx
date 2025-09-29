import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex'>
      {/* Left Section */}
      <div className='flex-1 flex items-center justify-center p-6 bg-white'>
        <Card className='w-full max-w-md shadow-xl p-6'>
          <CardContent>
            <h2 className='text-2xl font-semibold mb-2'>Welcome Back!</h2>
            <p className='text-sm text-gray-500 mb-6'>
              Enter your email address and password to log in to your account
            </p>

            <Button variant='outline' className='w-full mb-4 flex items-center justify-center gap-2'>
              <FcGoogle size={20} /> Sign in with Google
            </Button>

            <div className='flex items-center mb-4'>
              <Separator className='flex-1' />
              <span className='px-2 text-xs text-gray-400'>Or continue with</span>
              <Separator className='flex-1' />
            </div>

            <form className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='madisont@gmail.com' defaultValue='madisont@gmail.com' />
              </div>

              <div>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' type='password' defaultValue='**********' />
                <a href='#' className='text-xs text-blue-600 hover:underline mt-1 inline-block'>
                  Forgot password?
                </a>
              </div>

              <Button className='w-full'>Login</Button>
            </form>

            <p className='text-center text-sm text-gray-500 mt-4'>
              Not on Contakt?{' '}
              <a href='#' className='text-blue-600 hover:underline'>
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Section */}
      <div className='hidden md:flex flex-1 bg-[#0a2345] items-center justify-center text-center p-12'>
        <div>
          <h2 className='text-2xl font-semibold text-white mb-2'>Grow Your Business on Whatsapp</h2>
          <p className='text-gray-300 max-w-md mx-auto'>
            Sign up to Contakt universe and accelerate the speed in which you do business.
          </p>
        </div>
      </div>
    </div>
  );
}
