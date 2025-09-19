import localFont from 'next/font/local';

export const sfProRounded = localFont({
  src: [
    {
      path: '../assets/fonts/SF-Pro-Rounded-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Ultralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/SF-Pro-Rounded-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sf-rounded',
  display: 'swap',
});
