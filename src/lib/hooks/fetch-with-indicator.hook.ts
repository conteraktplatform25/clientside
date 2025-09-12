import { signIn } from 'next-auth/react';
import { useServerIndicatorStore } from '../store/defaults/server-indicator.store';

export async function fetchWithIndicatorHook(input: RequestInfo, init?: RequestInit) {
  const { startRequest, endRequest } = useServerIndicatorStore.getState();

  startRequest();
  try {
    const res = await fetch(input, init);
    return res;
  } finally {
    endRequest();
  }
}

export async function signInWithIndicatorHook(email: string, password: string, callbackUrl: string) {
  const { startRequest, endRequest } = useServerIndicatorStore.getState();

  startRequest();
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
      callbackUrl,
    });
    return res;
  } finally {
    endRequest();
  }
}
