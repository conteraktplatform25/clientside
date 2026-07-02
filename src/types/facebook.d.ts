export {};

declare global {
  interface Window {
    FB: FacebookSDK;
  }
  interface EmbeddedSignupAuthResponse {
    code?: string;
    accessToken?: string;
    userID?: string;
    expiresIn?: number;
    signedRequest?: string;
  }

  interface FacebookSDK {
    init: (options: {
      appId: string | undefined;
      cookie: boolean;
      xfbml: boolean;
      autoLogAppEvents: boolean;
      version: string | undefined;
    }) => void;
    // You can add more methods as needed, such as FB.login, FB.api, etc.
    login: (callback: (response: FacebookLoginResponse) => void, options?: Record<string, unknown>) => void;
  }
  interface FacebookLoginResponse {
    authResponse?: EmbeddedSignupAuthResponse;
    status?: string;
  }
}
