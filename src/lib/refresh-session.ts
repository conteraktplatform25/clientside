import axios from 'axios';

export const refreshClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function refreshSession() {
  await refreshClient.post('/auth/refresh');
}
