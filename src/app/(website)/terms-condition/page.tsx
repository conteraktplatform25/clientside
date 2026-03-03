// src/app/(website)/terms/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Contakt Platform',
  description: 'Terms and Conditions governing the use of the Contakt messaging platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <section className='relative bg-primary-50'>
      {/* Hero Section */}
      <div className='border-b border-primary-100'>
        <div className='container mx-auto px-6 py-8 text-center max-w-4xl'>
          <h1 className='text-3xl md:text-4xl font-bold text-primary-900 tracking-tight'>Terms & Conditions</h1>
          <p className='mt-3 text-base md:text-lg text-primary-600'>
            The rules and guidelines for using the Contakt platform.
          </p>
          <p className='mt-1 text-sm text-gray-500'>
            Last updated: {new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <main className='container mx-auto max-w-4xl pb-12'>
        <div className='space-y-12'>
          {/* Section 1 */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>1. Acceptance of Terms</h2>
            <p className='text-gray-700 leading-relaxed'>
              By accessing or using the Contakt platform, you agree to be bound by these Terms & Conditions. If you do
              not agree, you may not use our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>2. Description of Services</h2>
            <p className='text-gray-700 leading-relaxed'>
              Contakt provides businesses with tools to send and receive WhatsApp messages, automate communications, and
              manage customer interactions via approved integrations with messaging platforms.
            </p>
          </div>

          {/* Section 3 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>3. User Responsibilities</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li>Provide accurate registration information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Comply with all applicable laws and regulations.</li>
              <li>Obtain proper consent before messaging customers.</li>
              <li>Avoid sending spam, abusive, or unlawful content.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>4. Compliance with Messaging Policies</h2>
            <p className='text-gray-700 leading-relaxed'>
              You agree to comply with all applicable messaging platform policies, including WhatsApp Business Platform
              requirements. Violations may result in suspension or termination of your access to Contakt services.
            </p>
          </div>

          {/* Section 5 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>5. Account Suspension & Termination</h2>
            <p className='text-gray-700 leading-relaxed'>
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in abusive
              practices, or compromise the integrity of our platform.
            </p>
          </div>

          {/* Section 6 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>6. Fees & Payments</h2>
            <p className='text-gray-700 leading-relaxed'>
              Certain features of Contakt may require payment. All fees must be paid on time. Failure to do so may
              result in service interruption. Unless otherwise stated, payments are non-refundable.
            </p>
          </div>

          {/* Section 7 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>7. Intellectual Property</h2>
            <p className='text-gray-700 leading-relaxed'>
              All content, branding, software, and technology provided by Contakt remain our exclusive property. You may
              not copy, modify, distribute, or reverse engineer any part of the platform without written permission.
            </p>
          </div>

          {/* Section 8 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>8. Limitation of Liability</h2>
            <p className='text-gray-700 leading-relaxed'>
              To the maximum extent permitted by law, Contakt shall not be liable for indirect, incidental, or
              consequential damages arising from your use of the platform. We do not guarantee uninterrupted or
              error-free service.
            </p>
          </div>

          {/* Section 9 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>9. Governing Law</h2>
            <p className='text-gray-700 leading-relaxed'>
              These Terms shall be governed by and interpreted in accordance with the laws of your operating
              jurisdiction.
            </p>
          </div>

          {/* Section 10 */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-2xl font-semibold text-primary-900 mb-4'>10. Contact Information</h2>
            <p className='text-gray-700 leading-relaxed'>
              If you have questions regarding these Terms & Conditions, please contact us at:
            </p>
            <p className='mt-3 font-medium text-primary-700'>support@usecontakt.com</p>
          </div>
        </div>
      </main>
    </section>
  );
}
