'use client';

import Script from 'next/script';

export default function FacebookSDK() {
  return (
    <>
      <div id='fb-root'></div>
      <Script
        id='facebook-jssdk'
        strategy='afterInteractive'
        src={`https://connect.facebook.net/en_US/sdk.js`}
        onLoad={() => {
          if (!window.FB) {
            console.error('Facebook SDK not loaded');
            return;
          }
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_META_AI_APP_ID,
            autoLogAppEvents: true,
            cookie: true,
            xfbml: true,
            version: process.env.NEXT_PUBLIC_META_API_VERSION, // Use the latest version or specify as needed
          });

          console.log('Facebook SDK Initialized');
        }}
      />
    </>
  );
}
