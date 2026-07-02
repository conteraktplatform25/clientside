export const loginWithFacebookMeta = (metaConfigId: string): Promise<FacebookLoginResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not initialized.'));
      return;
    }
    window.FB.login(
      (response: FacebookLoginResponse) => {
        if (!response.authResponse?.code) {
          reject(new Error('Authorization code missing.'));
          return;
        }

        resolve(response);
      },
      {
        config_id: metaConfigId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {
            version: 'v4', // Specify the version of the Facebook SDK to use for the login flow
          },
        },
      },
    );
  });
};
