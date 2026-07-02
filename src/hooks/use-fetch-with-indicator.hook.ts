// import { signIn } from 'next-auth/react';
import { getApiException } from '@/lib/api-server';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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

// export async function signInWithIndicatorHook(email: string, password: string, callbackUrl: string) {
//   const { startRequest, endRequest } = useServerIndicatorStore.getState();

//   startRequest();
//   try {
//     return useMutation({
//       mutationFn: loginUserSvc,
//       onSuccess: () => {
//         toast.success('Login successful!');
//       },
//       onError: (error) => {
//         const errorMessage = getApiException(error);
//         toast.error(errorMessage);
//       },
//     });
//   } finally {
//     endRequest();
//   }
// }
