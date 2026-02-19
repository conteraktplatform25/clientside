import React, { ReactNode } from 'react';
import TopNavigationBar from './_component/TopNavigationBar';
import FooterSection from './_component/FooterSection';

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <TopNavigationBar />
      <main>{children}</main>
      <FooterSection />
    </>
  );
}
