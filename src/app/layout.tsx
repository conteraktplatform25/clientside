import { ReactNode } from 'react';
import './globals.css';
import localFont from 'next/font/local';
import ClientProviders from './ClientProviders';

const sfProRounded = localFont({
  src: [
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Ultralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-rounded/SFProRounded-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro-rounded',
  display: 'swap',
});
export const metadata = {
  other: {
    'facebook-domain-verification': 'nrqwrvblvk7ayi96s7qih0339u9jdc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${sfProRounded.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
