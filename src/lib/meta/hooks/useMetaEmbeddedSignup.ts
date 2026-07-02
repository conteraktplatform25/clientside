import { loginWithFacebookMeta } from '../utils/facebook';
import { useState } from 'react';
import { metaService } from '../services/meta.service';
import { MetaAccountProfile, TCompleteOnboardingPayload } from '../types/onboarding.type';

export const useMetaEmbeddedSignup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  const connect = async ({ meta_config_id }: { meta_config_id: string }): Promise<MetaAccountProfile | undefined> => {
    try {
      setLoading(true);
      setError(undefined);

      const loginResponse = await loginWithFacebookMeta(meta_config_id);
      const authorizationCode = loginResponse.authResponse!.code!;

      const embeddedResult = await new Promise<{
        wabaId: string;
        phoneNumberId: string;
      }>((resolve, reject) => {
        const handler = (event: MessageEvent) => {
          if (event.origin !== 'https://www.facebook.com') {
            return;
          }
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data.type === 'WA_EMBEDDED_SIGNUP') {
              switch (data.event) {
                case 'FINISH':
                  window.removeEventListener('message', handler);
                  resolve({
                    wabaId: data.data.waba_id,
                    phoneNumberId: data.data.phone_number_id,
                  });

                  break;
                case 'CANCEL':
                  window.removeEventListener('message', handler);
                  reject(new Error('User cancelled onboarding.'));

                  break;
                case 'ERROR':
                  window.removeEventListener('message', handler);
                  reject(new Error(data.data.error_message ?? 'Meta onboarding failed.'));
                  break;
              }
            }
          } catch (error) {
            window.removeEventListener('message', handler);
            reject(error);
          }
        };
        window.addEventListener('message', handler);
      });
      const payload: TCompleteOnboardingPayload = {
        authorizationCode,
        wabaId: embeddedResult.wabaId,
        phoneNumberId: embeddedResult.phoneNumberId,
      };

      const response = await metaService.onboarding(payload);

      setSuccess(true);

      return response.data?.data;
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : 'Unable to connect Meta.');
    } finally {
      setLoading(false);
    }
  };
  return {
    connect,

    loading,

    success,

    error,
  };
};
