// src/app/(website)/privacy-policy/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Contakt Platform',
  description: 'Privacy Policy explaining how Contakt collects, uses, and protects user data.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className='relative bg-primary-50'>
      {/* Hero Section */}
      <div className='border-b border-primary-100'>
        <div className='container mx-auto px-6 py-8 text-center max-w-4xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-primary-900 tracking-tight'>Privacy Policy</h1>
          <p className='mt-4 text-base md:text-lg text-primary-600'>
            How Contakt collects, uses, and protects your information.
          </p>
          <p className='mt-3 text-sm text-gray-500'>
            Last updated: {new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <main className='container mx-auto max-w-4xl pb-12'>
        <div className='space-y-8'>
          {/* Section 1 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>1. Introduction</h2>
            <p className='text-gray-700 leading-relaxed'>
              This Privacy Policy explains how Contakt platform collects, uses, and safeguards your information when you
              use our platform, including messaging services powered through WhatsApp Business integrations.
            </p>
          </div>

          {/* Section 2 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-6'>2. Information We Collect</h2>

            <div className='space-y-6'>
              <div>
                <h3 className='font-medium text-primary-800 mb-2'>Personal Information</h3>
                <ul className='list-disc list-inside text-gray-700 space-y-1'>
                  <li>Name and contact details</li>
                  <li>Email address</li>
                  <li>WhatsApp phone number</li>
                  <li>Business information (if applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className='font-medium text-primary-800 mb-2'>Usage Data</h3>
                <ul className='list-disc list-inside text-gray-700 space-y-1'>
                  <li>Messages sent through our platform</li>
                  <li>Device and browser information</li>
                  <li>Log data and timestamps</li>
                  <li>Analytics data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>3. How We Use Information</h2>
            <p className='text-gray-700 leading-relaxed mb-4'>We use collected information to:</p>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li>Provide WhatsApp messaging services</li>
              <li>Improve platform functionality</li>
              <li>Enhance customer support automation</li>
              <li>Ensure compliance with legal obligations</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>4. Data Sharing</h2>
            <p className='text-gray-700 leading-relaxed'>
              We do not sell user data. Information may be shared with trusted service providers, including WhatsApp
              Business infrastructure, strictly for message delivery and platform operation purposes.
            </p>
          </div>

          {/* Section 5 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>5. Data Security</h2>
            <p className='text-gray-700 leading-relaxed'>
              We implement appropriate technical and organizational measures, including encrypted connections (HTTPS),
              access controls, and secure infrastructure to protect your information.
            </p>
          </div>

          {/* Section 6 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>6. Contact Us</h2>
            <p className='text-gray-700 leading-relaxed'>
              If you have any questions regarding this Privacy Policy, please contact us at:
            </p>
            <p className='mt-3 font-medium text-primary-700'>support@usecontakt.com</p>
          </div>
        </div>
      </main>
    </section>
  );
}
