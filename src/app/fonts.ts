import localFont from 'next/font/local';

export const sfProRounded = localFont({
  src: [
    {
      path: './assets/fonts/SF-Pro-Rounded-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Heavy.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './assets/fonts/SF-Pro-Rounded-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sf-rounded',
  display: 'swap',
});
