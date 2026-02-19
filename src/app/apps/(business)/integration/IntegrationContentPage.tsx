'use client';
import React, { useEffect } from 'react';
import IntegrationCard from './_component/IntegrationCard';
import { showSuccess } from '@/utils/toast';
import { ConstIntegrations as integrations } from '@/lib/constants/integration.constant';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const IntegrationContentPage: React.FC = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Integrations');
  }, [setTitle]);

  const handleConnect = (integrationName: string) => {
    showSuccess(`Connecting to ${integrationName}... (functionality to be implemented)`);
    // In a real application, this would trigger an authentication flow or API call
  };

  return (
    <div className='container mx-auto p-4'>
      <p className='text-muted-foreground mb-8'>
        Connect your favorite tools and services to enhance your workflow and expand your capabilities.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            title={integration.name}
            description={integration.description}
            src={integration.img_src!}
            onConnect={() => handleConnect(integration.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationContentPage;
